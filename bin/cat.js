#!/usr/bin/env node

var cat           = require('../lib/cat')
var InspectStream = require('../lib/common').InspectStream


var result = cat(process.argv.slice(2))

result.pipe(InspectStream()).pipe(process.stdout)
