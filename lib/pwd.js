const str = require('string-to-stream')

const decodeArguments = require('./common').decodeArguments


const DEFAULT_MODE = 'physical'


function pwd()
{
  var args = decodeArguments(arguments)

  args['logical' ] = args['logical' ] || args.L
  args['physical'] = args['physical'] || args.P

  var mode = DEFAULT_MODE
  if(args['logical ']) mode = 'logical'
  if(args['physical']) mode = 'physical'

  var result
  if(mode === 'logical')
    result = process.env['CWD']
  else
    result = process.cwd()

  return str(result)
}


module.exports = pwd
