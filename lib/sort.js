#!/usr/bin/env node


var minimist = require('minimist');

var improveListCommands = require('./improveListCommands.js')


function sort()
{
  if(typeof this == 'string') return sort.apply(this.split('\n'), arguments).join('\n')

  if(this instanceof Array);


  var args = (typeof arguments[0] == 'object') ? arguments : minimist(arguments)

  if(args.r) args.reverse = true;


  var result = []


  if(args.reverse) result.reverse()


  improveListCommands(result)

  return result
}


module.exports = sort;


if(!module.parent)
{
  sort.apply(process.stdin, process.argv.slice(2))
}
