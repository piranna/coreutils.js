#!/usr/bin/env node

const ls = require('../lib/ls')


var result = ls(process.argv.slice(2))

result.pipe(process.stdout)

try
{
  var result = ls(process.argv.slice(2))
}
catch(e)
{
  console.error(e)
  process.exit(2)
}

var warnings = false
result.forEach(function(line)
{
  if(line instanceof Error)
  {
    warnings = true
    return console.warning(line)
  }
})

console.log(result.inspect())

if(warnings)
  process.exit(1)
