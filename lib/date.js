const util = require('util')

const str = require('string-to-stream')

const decodeArguments = require('./common').decodeArguments;


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

  return str(new Date().toString())
}


module.exports = date
