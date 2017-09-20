#!/usr/bin/env node

const getDetails = require('./src/utils/getDetails')
const command = process.argv[process.argv.indexOf('fa') + 1]

require(`./src/${command}`)(getDetails(command === 'setup'))
