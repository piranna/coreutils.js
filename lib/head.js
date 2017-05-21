const createReadStream = require('fs').createReadStream

const {Readable, Transform} = require('stream')

const {ArgumentParser, Namespace} = require('argparse')

const inherits           = require('inherits')
const OrderedReadStreams = require('ordered-read-streams')
const ReadlineStream     = require('readline-stream')


function decodeArguments(argv)
{
  argv = Array.from(argv)

  if(argv[0] && argv[0] instanceof Namespace) return argv[0]

  const parser = new ArgumentParser({debug: true})

  parser.addArgument(['-c', '--bytes'], {defaultValue: Number.POSITIVE_INFINITY})
  parser.addArgument(['-n', '--lines'], {defaultValue: 10})
  parser.addArgument(['-z', '--zero-terminated'],
  {
    action: 'storeTrue',
    help: 'line delimiter is NUL, not newline'
  })
  parser.addArgument(['-q', '--quiet', '--silent'],
  {
    action: 'storeFalse',
    dest: 'verbose'
  })
  parser.addArgument(['-v', '--verbose'], {action: 'storeTrue'})
  parser.addArgument('file', {nargs: '*'})

  return parser.parseArgs(argv)
}


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

function multiplierSufix(value)
{
  if(typeof value !== 'string') return value

  let mult = 1

  value = value.match(/(\d+)(\w*)/)

  switch(value[1])
  {
    case 'b': mult *= 512; break

    case 'YB': mult *= 1000
    case 'ZB': mult *= 1000
    case 'EB': mult *= 1000
    case 'PB': mult *= 1000
    case 'TB': mult *= 1000
    case 'GB': mult *= 1000
    case 'MB': mult *= 1000
    case 'kB': mult *= 1000; break

    case 'Y': mult *= 1024
    case 'Z': mult *= 1024
    case 'E': mult *= 1024
    case 'P': mult *= 1024
    case 'T': mult *= 1024
    case 'G': mult *= 1024
    case 'M': mult *= 1024
    case 'K': mult *= 1024; break
  }

  return value[0] * mult
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
      if(bytes > 0 && lines-- > 0) return cb(null, chunk)

      this._transform = function(chunk, encoding, cb){cb()}
      cb(null, null)
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

  let files = args.file
  switch(files.length)
  {
    case 0: return new Head(args)
    case 1: return getStream(args, files[0])
  }



}

head.Head = Head
head.decodeArguments = decodeArguments


module.exports = head
