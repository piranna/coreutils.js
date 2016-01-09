#!/usr/bin/env node

var uname = require('../lib/uname')

console.log(uname(process.argv.slice(2)))