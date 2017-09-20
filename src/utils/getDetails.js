const fs = require('fs')
const path = require('path')
const home = require('node-homedir')
const exists = require('file-exists')
const getAMI = require('./getAMI')

const argv = require('minimist')(process.argv)

const getDetails = setup => {
  const file = path.join(process.cwd(), argv.file || './fast-ai-instance.json')
  if (!setup && !exists.sync(file)) {
    console.log(`"${file}" does not exist, have you ran "fa setup"?`)
    process.exit(1)
  }
  const details = {
    instance: exists.sync(file) ? JSON.parse(fs.readFileSync(file)) : {},
    options: {
      file,
      name: argv.name || 'fast-ai',
      region: argv.region || 'eu-west-1',
      instance: argv.instance
        ? argv.instance.includes('.')
          ? argv.instance
          : `${argv.instance}.xlarge`
        : 'p2.xlarge',
      ami: argv.ami,
      key: argv.key
        ? argv.key.startsWith('~') ? argv.key.replace('~', home()) : argv.key
        : `${home()}/.ssh/aws-key.pem`,
      keyName: argv['key-name']
    }
  }

  const {ami, instance, region, key, keyName} = details.options

  if (!ami) details.options.ami = getAMI(instance, region)
  if (!keyName) details.options.keyName = path.basename(key, path.extname(key))
  if (!exists.sync(details.options.key)) {
    console.log(`"${key}" does not exist, have you created a key?`)
    process.exit(1)
  }

  return details
}

module.exports = getDetails
