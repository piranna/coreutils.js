#!/usr/bin/env node

const head   = require('../lib/head')
const common = require('../lib/common')

const InspectStream = common.InspectStream


const args = head.decodeArguments(process.argv.slice(2))

let result = head(args)

//if(args.file.length > 1) result = head.verbose(result, args)

const files = args.file
if(!files.length || files.includes('-')) process.stdin.pipe(result)

result.pipe(InspectStream()).pipe(process.stdout)
