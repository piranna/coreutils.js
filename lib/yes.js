var Readable = require('stream').Readable

var inherits = require('inherits')


function inspect()
{
  return this + '\n'
}


function Yes(string)
{
  if(!(this instanceof Dirname)) return new Dirname(string);

  Dirname.super_.call(this, {objectMode: true});


  string = string || 'y'

  Object.defineProperty(string, 'inspect', {value: inspect});


  this._read = function(size)
  {
    this.push(string)
  }
}
inherits(Yes, Readable)

Object.defineProperty(Yes.prototype, 'type', {value: 'scheme=coreutils.yes'})


function yes()
{
  var args = arguments[0] instanceof Array ? arguments[0] : arguments

  return Yes(args.join(' '))
}

yes.Yes = Yes


module.exports = yes
