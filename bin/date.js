#!/usr/bin/env node

var util = require('util')

var date = require('../lib/date')


var result = date(process.argv.slice(2))

process.stdout.write(util.inspect(result))
