const AMI = {
  'p2.xlarge': {
    'us-west-2': 'ami-bc508adc',
    'eu-west-1': 'ami-b43d1ec7',
    'us-east-1': 'ami-31ecfb26'
  },
  't2.xlarge': {
    'us-west-2': 'ami-f8fd5998',
    'eu-west-1': 'ami-9e1a35ed',
    'us-east-1': 'ami-9c5b438b'
  }
}

const ERRORS = {
  instance: 'Only p2.xlarge, and t2.xlarge are currently supported',
  region:
    'Only us-west-2 (Oregon), eu-west-1 (Ireland), and us-east-1 (Virginia) are currently supported'
}

const getAMI = (instance, region) => {
  if (!AMI[instance]) {
    console.log(ERRORS.instance)
    process.exit(1)
  } else if (!AMI[instance][region]) {
    console.log(ERRORS.region)
    process.exit(1)
  }
  return AMI[instance][region]
}

module.exports = getAMI
