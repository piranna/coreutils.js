#!/usr/bin/env node

var echo = require('../lib/echo')


var result = echo(process.argv.slice(2))

process.stdout.write(result)
