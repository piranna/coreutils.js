#!/usr/bin/env node

var dirname       = require('../lib/dirname')
var InspectStream = require('../lib/common').InspectStream


var result = dirname(process.argv.slice(2))

result.pipe(InspectStream()).pipe(process.stdout)
