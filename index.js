#!/usr/bin/env node

const getDetails = require('./src/utils/getDetails')
const command =
  process.argv[process.argv.findIndex(arg => arg.endsWith('fa')) + 1]

require(`./src/${command}`)(getDetails(command === 'setup'))
