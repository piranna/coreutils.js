#!/usr/bin/env node

var echo = require('../lib/echo')
var InspectStream = require('../lib/common').InspectStream


var result = echo(process.argv.slice(2))

result.pipe(InspectStream()).pipe(process.stdout)
