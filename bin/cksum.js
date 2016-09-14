#!/usr/bin/env node

var cksum         = require('../lib/cksum')
var InspectStream = require('../lib/common').InspectStream


var result = cksum(process.argv.slice(2))

result.pipe(InspectStream()).pipe(process.stdout)
