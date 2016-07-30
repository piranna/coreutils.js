const Readable = require('stream').Readable

const inherits = require('inherits')

const decodeArguments = require('./common').decodeArguments;


function Echo(args)
{
  if(!(this instanceof Echo)) return new Echo(args)

  args = args || {}
  args.objectMode = true

  Echo.super_.call(this, args)

  var result = args._.join(' ')
  if (!args.n) result += '\n'

  result = new String(result)
  result.type = 'echo'

  this.push(result)
  this.push(null)
}
inherits(Echo, Readable)

Object.defineProperty(Echo.prototype, 'type', {value: 'scheme=coreutils.echo'});


/**
 * @return {Readable}
 */
function echo()
{
  return Echo(decodeArguments(arguments))
}

echo.Echo = Echo


module.exports = echo
