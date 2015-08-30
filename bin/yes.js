#!/usr/bin/env node

var yes       = require('../lib/yes')
var InspectStream = require('../lib/common').InspectStream


var result = yes(process.argv.slice(2))

result.pipe(InspectStream()).pipe(process.stdout)
