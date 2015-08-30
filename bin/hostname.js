#!/usr/bin/env node

var hostname      = require('../lib/hostname')
var InspectStream = require('../lib/common').InspectStream


var result = hostname(process.argv.slice(2))

result.pipe(InspectStream()).pipe(process.stdout)
