#!/usr/bin/env node

var sort = require('../lib/head')


var result = head(process.argv.slice(2))

result.pipe(InspectStream()).pipe(process.stdout)
