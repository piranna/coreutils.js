const createReadStream = require('fs').createReadStream
const stream           = require('stream')

const Readable  = stream.Readable
const Transform = stream.Transform

const inherits           = require('inherits')
const ReadlineStream     = require('readline-stream')
const OrderedReadStreams = require('ordered-read-streams')

const decodeArguments = require('./common').decodeArguments


function getStream(args, file)
{
  let head = new Head(args)

  if(file === '-') return head

  if(typeof file === 'string')
  {
    Object.defineProperty(head, 'path', {value: file})

    file = createReadStream(file)
  }
  else if(file.path)
    Object.defineProperty(head, 'path', {value: file.path})

  return file.pipe(head)
}


//
// Public API
//

function Head(args)
{
  if(!(this instanceof Head)) return new Head(args)

  Head.super_.call(this, {objectMode: true})


  var bytes = multiplierSufix(args.bytes) || Number.POSITIVE_INFINITY
  var lines = multiplierSufix(args.lines) || (bytes === Number.POSITIVE_INFINITY
                                             ? 10 : Number.POSITIVE_INFINITY)

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

  if(allButLastLines)
  {
    const delayQueue = []

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


  const re = args['zero-terminated'] ? /.*?(?:\0|$)/g : null

  this.on('pipe', function(src)
  {
    if(src.objectMode || src._readableState && src._readableState.objectMode)
      return Object.defineProperty(this, 'type', {value: src.type})

    const rls = ReadlineStream({re})
    Object.defineProperty(rls, 'type', {value: src.type})

    src.unpipe(this)
    src.pipe(rls).pipe(this)
  })
}
inherits(Head, Transform)


/**
 * @return {Transform}
 */
function head()
{
  const args = decodeArguments(arguments)

  args['bytes'] = args['bytes'] || args.c
  args['lines'] = args['lines'] || args.n

  args['zero-terminated'] = args['zero-terminated'] || args.z

  let files = args._
  switch(files.length)
  {
    case 0: return new Head(args)
    case 1: return getStream(args, files[0])
  }



}

head.Head = Head


module.exports = head
