var createWriteStream = require('fs').createWriteStream
var Transform         = require('stream').Transform

var inherits = require('inherits')

var decodeArguments = require('./common').decodeArguments


function Tee(args)
{
  if(!(this instanceof Tee)) return new Tee(args);

  Tee.super_.call(this, {objectMode: true});


  this._transform = function(chunk, encoding, cb)
  {
    args.streams.forEach(function(stream)
    {
      if(stream) return stream.write(chunk)

      // stream not defined, so send it to standard (pipe) output instead
      this.push(chunk);
    })

    this.push(chunk);
    cb()
  }

  this.on('pipe', function(src)
  {
    Object.defineProperty(this, 'type', {value: src.type});
  })
}
inherits(Tee, Transform)


/**
 * @return {Transform}
 */
function tee()
{
  var args = decodeArguments(arguments)

  if(args.a || args['append'])
    var options = {flags: 'r+'}

  args.streams = args._.map(function(file)
  {
    if(file !== '-')
      return createWriteStream(file, options)
  })
  delete args._

//  if(args.i) args['ignore-interrupts'] = true


  return Tee(args)
}

tee.Tee = Tee


module.exports = tee
