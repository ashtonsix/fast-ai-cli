const getEC2 = require('./utils/getEC2')

async function stop({options, instance}) {
  const ec2 = getEC2(options.region)

  console.log('\nStopping instance...\n')
  await ec2.stopInstances({InstanceIds: [instance.id]})
  console.log('\nFinished\n')
}

module.exports = stop
