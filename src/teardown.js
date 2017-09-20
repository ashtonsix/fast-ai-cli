const fs = require('fs')
const exists = require('file-exists')
const getEC2 = require('./utils/getEC2')

async function teardown({options, instance}) {
  const ec2 = getEC2(options.region)

  if (!exists.sync(options.file)) {
    console.log(`Cannot find "${options.file}"`)
    process.exit(1)
  }

  console.log()

  await ec2.disassociateAddress({AssociationId: instance.addressAssociation})
  await ec2.releaseAddress({AllocationId: instance.allocationId})

  await ec2.terminateInstances({InstanceIds: [instance.id]})
  await ec2.waitFor('instanceTerminated', {InstanceIds: [instance.id]})
  await ec2.deleteSecurityGroup({GroupId: instance.securityGroupId})

  await ec2.disassociateRouteTable({
    AssociationId: instance.routeTableAssociation
  })
  await ec2.deleteRouteTable({RouteTableId: instance.routeTableId})

  await ec2.detachInternetGateway({
    InternetGatewayId: instance.internetGatewayId,
    VpcId: instance.vpcId
  })
  await ec2.deleteInternetGateway({
    InternetGatewayId: instance.internetGatewayId
  })
  await ec2.deleteSubnet({SubnetId: instance.subnetId})

  await ec2.deleteVpc({VpcId: instance.vpcId})

  if (exists.sync(options.file)) fs.unlinkSync(options.file)
  console.log('\nTeardown complete\n')
  return instance
}

module.exports = teardown
