var path   = require('path')
var stream = require('stream')

var inherits = require('inherits')

var decodeArguments = require('./common').decodeArguments


function inspectNull()
{
  return this + '\0'
}

function inspectNewline()
{
  return this + '\n'
}


function Dirname(args)
{
  if(!(this instanceof Dirname)) return new Dirname(args);

  Dirname.super_.call(this, {objectMode: true});


  var inspect = args['zero'] ? inspectNull : inspectNewline


  this._transform = function(chunk, encoding, done)
  {
    chunk = path.dirname(chunk)

    Object.defineProperty(chunk, 'inspect', {value: inspect});

    this.push(chunk)
    done()
  }
}
inherits(Dirname, stream.Transform)

Object.defineProperty(Dirname.prototype, 'type', {value: 'scheme=coreutils.dirname'})


function dirname()
{
  var args = decodeArguments(arguments)

  var names = new stream.Readable({objectMode: true})
  var push = names.push.bind(result)

  args._.forEach(push)
  push(null)  // end of array

  delete args._

  if(args.z) args['zero'] = true

  return names.pipe(Dirname(args))
}

dirname.Dirname = Dirname


module.exports = dirname
