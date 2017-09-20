const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const getEC2 = require('./utils/getEC2')

async function start({options, instance}) {
  const ec2 = getEC2(options.region)

  console.log('\nStarting instance...\n')
  await ec2.startInstances({InstanceIds: [instance.id]})
  await ec2.waitFor('instanceExists', {InstanceIds: [instance.id]})
  const Instances = await ec2.describeInstances({InstanceIds: [instance.id]})
  const URL = Instances.Reservations[0].Instances[0].PublicDnsName
  instance = {...instance, URL}
  mkdirp.sync(path.dirname(options.file))
  fs.writeFileSync(options.file, JSON.stringify(instance, null, 2))
  console.log('\nFinished\n')
}

module.exports = start
