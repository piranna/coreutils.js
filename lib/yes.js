var Readable = require('stream').Readable

var inherits = require('inherits')


function inspect()
{
  return this + '\n'
}


function Yes(string)
{
  if(!(this instanceof Yes)) return new Yes(string)

  Yes.super_.call(this, {objectMode: true})


  string = new String(string || 'y')

  Object.defineProperty(string, 'inspect', {value: inspect});


  Object.defineProperty(this, 'string', {value: string});
}
inherits(Yes, Readable)

Yes.prototype._read = function(size)
{
  this.push(this.string)
}

Object.defineProperty(Yes.prototype, 'type', {value: 'scheme=coreutils.yes'})


function yes()
{
  var args = arguments[0] instanceof Array ? arguments[0] : Array.from(arguments)

  return Yes(args.join(' '))
}

yes.Yes = Yes


module.exports = yes
