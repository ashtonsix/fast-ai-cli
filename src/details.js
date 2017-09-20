const KEYS = [
  'URL',
  'name',
  'id',
  'key',
  'keyName',
  'vpcId',
  'subnetId',
  'securityGroupId',
  'routeTableId',
  'internetGatewayId',
  'allocationId',
  'addressAssociation',
  'routeTableAssociation'
]

const details = ({instance}) => {
  const longest = Math.max(...KEYS.map(k => k.length)) + 1
  for (const k of KEYS) {
    console.log(`${(k + ':').padEnd(longest)} ${instance[k]}`)
  }
}

module.exports = details
