#!/usr/bin/env node

const tee           = require('../lib/tee')
const InspectStream = require('../lib/common').InspectStream


var result = tee(process.argv.slice(2))

result.pipe(InspectStream()).pipe(process.stdout)
