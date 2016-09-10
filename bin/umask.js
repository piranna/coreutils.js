#!/usr/bin/env node

const umask         = require('../lib/umask')
const InspectStream = require('../lib/common').InspectStream


var result = umask(process.argv.slice(2))

result.pipe(InspectStream()).pipe(process.stdout)
