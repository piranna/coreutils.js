#!/usr/bin/env node

var grep = require('../lib/grep')

var InspectStream   = require('./common').InspectStream;


var result = grep(process.argv.slice(2))

result.pipe(InspectStream()).pipe(process.stdout)
