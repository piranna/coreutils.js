#!/usr/bin/env node

var decodeArguments = require('./_common').decodeArguments;


/**
 * @return {String}
 */
function echo()
{
  //
  // Process arguments
  //
  var args = decodeArguments(arguments)

  var result = args._.join(' ');
  if (!args.n) result += '\n';


  //
  // Process files
  //

  return result
}


module.exports = echo;


if(!module.parent)
{
  var result = echo(process.argv.slice(2))

  process.stdout.write(result)
}
