#!/usr/bin/env node

const head   = require('../lib/head')
const common = require('../lib/common')

const decodeArguments = common.decodeArguments
const InspectStream   = common.InspectStream


const args = decodeArguments(process.argv.slice(2))

let result = head(args)

process.stdin.pipe(result).pipe(InspectStream()).pipe(process.stdout)
