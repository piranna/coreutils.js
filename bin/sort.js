#!/usr/bin/env node

const sort          = require('../lib/sort')
const InspectStream = require('../lib/common').InspectStream


var result = sort(process.argv.slice(2))

result.pipe(InspectStream()).pipe(process.stdout)
