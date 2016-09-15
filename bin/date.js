#!/usr/bin/env node

const date = require('../lib/date')
const InspectStream = require('../lib/common').InspectStream


var result = date(process.argv.slice(2))

result.pipe(InspectStream()).pipe(process.stdout)
