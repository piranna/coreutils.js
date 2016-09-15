#!/usr/bin/env node

var pwd           = require('../lib/pwd')
var InspectStream = require('../lib/common').InspectStream


var result = pwd(process.argv.slice(2))

result.pipe(InspectStream()).pipe(process.stdout)
