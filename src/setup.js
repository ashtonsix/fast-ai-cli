const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const exists = require('file-exists')
const getEC2 = require('./utils/getEC2')
const teardown = require('./teardown')

const CIDR = '0.0.0.0/0'
const CIDR_BLOCK = '10.0.0.0/16'

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

async function setup({options, instance}) {
  const ec2 = getEC2(options.region)
  const tag = (resource, suffix = '') => {
    const tagName = `${options.name}${suffix ? '-' : ''}${suffix}`
    return ec2.createTags({
      Resources: [resource],
      Tags: [{Key: 'Name', Value: tagName}]
    })
  }

  if (exists.sync(options.file)) teardown({options, instance})

  console.log()

  const {Vpc: {VpcId}} = await ec2.createVpc({CidrBlock: CIDR_BLOCK})
  await tag(VpcId, 'vpc')
  await ec2.modifyVpcAttribute({VpcId, EnableDnsSupport: {Value: true}})
  await ec2.modifyVpcAttribute({VpcId, EnableDnsHostnames: {Value: true}})

  const {InternetGateway} = await ec2.createInternetGateway()
  const {InternetGatewayId} = InternetGateway
  await tag(InternetGatewayId, 'gateway')
  await ec2.attachInternetGateway({VpcId, InternetGatewayId})

  const {Subnet: {SubnetId}} = await ec2.createSubnet({
    CidrBlock: CIDR_BLOCK,
    VpcId
  })
  await tag(SubnetId, 'subnet')

  const {RouteTable: {RouteTableId}} = await ec2.createRouteTable({VpcId})
  await tag(RouteTableId, 'route-table')
  const {AssociationId: RouteTableAssoc} = await ec2.associateRouteTable({
    RouteTableId,
    SubnetId
  })
  await ec2.createRoute({
    RouteTableId,
    DestinationCidrBlock: CIDR,
    GatewayId: InternetGatewayId
  })

  const {GroupId} = await ec2.createSecurityGroup({
    GroupName: `${options.name}-security-group`,
    Description: 'SG for fast.ai machine',
    VpcId
  })
  await ec2.authorizeSecurityGroupIngress({
    GroupId,
    IpProtocol: 'tcp',
    FromPort: 22,
    ToPort: 22,
    CidrIp: CIDR
  })
  await ec2.authorizeSecurityGroupIngress({
    GroupId,
    IpProtocol: 'tcp',
    FromPort: 8888,
    ToPort: 8898,
    CidrIp: CIDR
  })

  const {Instances: [{InstanceId}]} = await ec2.runInstances({
    ImageId: options.ami,
    MinCount: 1,
    MaxCount: 1,
    InstanceType: options.instance,
    KeyName: options.keyName,
    SubnetId,
    SecurityGroupIds: [GroupId],
    BlockDeviceMappings: [
      {DeviceName: '/dev/sda1', Ebs: {VolumeSize: 128, VolumeType: 'gp2'}}
    ]
  })
  tag(InstanceId, 'gpu-machine')
  const {AllocationId} = await ec2.allocateAddress({Domain: 'vpc'})

  console.log('\nWaiting for instance to start...\n')
  await ec2.waitFor('instanceRunning', {InstanceIds: [InstanceId]})
  await sleep(10000) // wait for ssh service

  const {AssociationId: AddressAssoc} = await ec2.associateAddress({
    InstanceId,
    AllocationId
  })
  const Instances = await ec2.describeInstances({InstanceIds: [InstanceId]})
  const URL = Instances.Reservations[0].Instances[0].PublicDnsName

  console.log('\nRestarting instance...\n')
  await ec2.rebootInstances({InstanceIds: [InstanceId]})

  instance = {
    id: InstanceId,
    URL,
    key: options.key,
    keyName: options.keyName,
    subnetId: SubnetId,
    securityGroupId: GroupId,
    routeTableId: RouteTableId,
    name: options.name,
    vpcId: VpcId,
    internetGatewayId: InternetGatewayId,
    allocationId: AllocationId,
    addressAssociation: AddressAssoc,
    routeTableAssociation: RouteTableAssoc
  }

  mkdirp.sync(path.dirname(options.file))
  fs.writeFileSync(options.file, JSON.stringify(instance, null, 2))
  console.log('\nSetup complete. Try "fa ssh" \n')

  return instance
}

module.exports = setup
