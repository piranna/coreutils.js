#!/usr/bin/env node

var _common = require('./_common');


var decodeArguments = _common.decodeArguments;


function date()
{
  var args = decodeArguments(arguments)

  args['date']      = args['date']      || args.d
  args['file']      = args['file']      || args.f
  args['iso-8601']  = args['iso-8601']  || args.I
  args['reference'] = args['reference'] || args.r
  args['rfc-2822']  = args['rfc-2822']  || args.R
  args['set']       = args['set']       || args.s
  args['universal'] = args['universal'] || args['utc'] || args.u

  //args['rfc-3339']

  var result = new Date()

  function inspect()
  {
    return result
  }

  Object.defineProperty(result, 'inspect', {value: inspect})

  return result
}


module.exports = date;


if(!module.parent)
{
  console.log(date(process.argv.slice(2)))
}
