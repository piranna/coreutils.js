#!/usr/bin/env node

const grep          = require('../lib/grep')
const InspectStream = require('../lib/common').InspectStream;


var result = grep(process.argv.slice(2))

result.pipe(InspectStream()).pipe(process.stdout)
