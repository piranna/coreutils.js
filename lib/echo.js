#!/usr/bin/env node


var minimist = require('minimist');


function echo()
{
  var args = minimist(arguments)

  var result = args._.join(' ');
  if (!args.n) result += '\n';

  return result
}


module.exports = echo;


if(!module.parent)
{
  echo(process.argv.slice(2))
}
