var Transform = require('stream').Transform

var inherits = require('inherits')


function Head(args)
{
  if(!(this instanceof Head)) return new Head(args)

  Head.super_.call(this, {objectMode: true})


  var bytes = args.bytes || Math.Infinity
  var lines = args.lines || (bytes ? Math.Infinity : 10)

  if(bytes < 0)
  {
    var allButLastBytes = true
    bytes = Math.abs(bytes)
  }
  if(lines < 0)
  {
    var allButLastLines = true
    lines = Math.abs(lines)
  }

  var verbose = args.verbose !== false


  if(allButLastLines)
  {
    var delayQueue = []

    this._transform = function(chunk, encoding, cb)
    {
      if(lines-- <= 0) this.push(delayQueue.shift())

      delayQueue.push(chunk)

      cb()
    }
  }
  else
    this._transform = function(chunk, encoding, cb)
    {
//      bytes -= (chunk.length || 0)
      if(bytes > 0 && lines-- > 0)
        this.push(chunk)
      else
        this._transform = function(chunk, encoding, cb){cb()}

      cb()
    }


  this.on('pipe', function(src)
  {
    Object.defineProperty(this, 'type', {value: src.type});
  })
}
inherits(Head, Transform)


/**
 * @return {Transform}
 */
function head()
{
  var args = decodeArguments(arguments)

  args['bytes'] = args['bytes'] || args.c
  args['lines'] = args['lines'] || args.n

  args['verbose'] = args['verbose'] || args.v
                 || !(args['quiet'] || args['silent'] || args.q)

  args.streams = args._.map(function(file)
  {
    if(file !== '-')
      return createWriteStream(file, options)
  })
  delete args._

//  if(args.i) args['ignore-interrupts'] = true


  return Tee(args)
}

head.Head = Head


module.exports = head
