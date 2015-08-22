#!/usr/bin/env node

var sort = require('../lib/sort')


var result = sort(process.argv.slice(2))

result.pipe(InspectStream()).pipe(process.stdout)
