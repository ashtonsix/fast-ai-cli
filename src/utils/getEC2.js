const AWS = require('aws-sdk')

const METHODS = [
  'allocateAddress',
  'associateAddress',
  'associateRouteTable',
  'attachInternetGateway',
  'authorizeSecurityGroupIngress',
  'createInternetGateway',
  'createRoute',
  'createRouteTable',
  'createSecurityGroup',
  'createSubnet',
  'createTags',
  'createVpc',
  'deleteInternetGateway',
  'deleteRouteTable',
  'deleteSecurityGroup',
  'deleteSubnet',
  'deleteVpc',
  'describeInstances',
  'detachInternetGateway',
  'disassociateAddress',
  'disassociateRouteTable',
  'modifyVpcAttribute',
  'rebootInstances',
  'releaseAddress',
  'runInstances',
  'startInstances',
  'stopInstances',
  'terminateInstances',
  'waitFor'
]

const getEC2 = region => {
  AWS.config.update({region})

  const _ec2_ = new AWS.EC2()
  const ec2 = {}

  for (const k of METHODS) {
    if (typeof _ec2_[k] !== 'function') continue
    ec2[k] = (...args) => {
      console.log(`ec2.${k}`)
      return new Promise((resolve, reject) => {
        return _ec2_[k](
          ...args,
          (err, data) => (err ? reject(err) : resolve(data))
        )
      }).catch(err => {
        console.log(err.stack)
        console.log('exiting...')
        process.exit(1)
      })
    }
  }

  return ec2
}

module.exports = getEC2
