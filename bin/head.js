#!/usr/bin/env node

const head          = require('../lib/head')
const InspectStream = require('../lib/common').InspectStream;


var result = head(process.argv.slice(2))

result.pipe(InspectStream()).pipe(process.stdout)
