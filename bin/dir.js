#!/usr/bin/env node

var dir = require('../lib/dir')


var result = dir(process.argv.slice(2))

result.pipe(InspectStream()).pipe(process.stdout)

return  // Testing


try
{
  var result = dir(process.argv.slice(2))
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
