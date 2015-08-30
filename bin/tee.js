#!/usr/bin/env node

var sort = require('../lib/tee')


var result = tee(process.argv.slice(2))

result.pipe(InspectStream()).pipe(process.stdout)
