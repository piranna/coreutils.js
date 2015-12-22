var fs     = require('fs')
var stream = require('stream')
var util   = require('util')

var ReadlineStream     = require('readline-stream');
var minimist           = require('minimist');
var OrderedReadStreams = require('ordered-read-streams');


var Stream   = stream.Stream
var Readable = stream.Readable


function decodeArguments(arguments)
{
  return arguments[0] && arguments[0].constructor === Object
       ? arguments[0] : arguments[0] instanceof Array
                      ? minimist(arguments[0])
                      : minimist(arguments)
}

function stdinStream(stdin)
{
  if(typeof stdin === 'string') stdin = stdin.split('\n')

  if(stdin instanceof Array)
  {
    var result = new Readable({objectMode: true})
    var push = result.push.bind(result)

    stdin.forEach(push)
    push(null)  // end of array

    return result
  }

  if(stdin == null || stdin === global) stdin = process.stdin

  if(stdin instanceof Stream)
  {
    if(stdin._readableState.objectMode)
      return stdin

    return stdin.pipe(new ReadlineStream())
  }

  throw Error('Unknown object as stdin: '+stdin)
}


function FileLineStream(filename)
{
  if(!(this instanceof FileLineStream)) return new FileLineStream(filename);

  FileLineStream.super_.call(this, {objectMode: true});

  var numLine = 0

  this._transform = function(line, encoding, cb)
  {
    var chunk =
    {
      data: line,
      file: filename,
      line: numLine++
    }

    this.push(chunk);
    cb()
  }
}
util.inherits(FileLineStream, stream.Transform)

function filesStream(files)
{
  if(!files.length) files = ['-']

  var streams = files.map(function(file)
  {
    var stream = (file === '-')
               ? this
               : fs.createReadStream(file);

    return stdinStream(stream).pipe(new FileLineStream(file));
  }, this)

  return new OrderedReadStreams(streams)
}


function isBuffer (chunk) {
  // it seems like chunks emitted from a readable are considered not to be buffers by the browserify-buffer module
  // mainly because instanceof chunk !== Buffer although chunk is actually a Buffer
  // however these Buffers have an .offset and .get, and numerous .read methods, so if we find these we'll assume it's a buffer
  return Buffer.isBuffer(chunk)
    || ( typeof chunk.offset === 'number'
      && typeof chunk.get === 'function'
      && typeof chunk.readDoubleBE === 'function'
      && typeof chunk.readInt32BE === 'function')
}

function InspectStream(depth, context)
{
  if(!(this instanceof InspectStream))
    return new InspectStream(depth, context);

  InspectStream.super_.call(this, {objectMode: true});


  this._transform = function(chunk, encoding, cb)
  {
    var data;

    if(chunk instanceof Error)
    {
      console.err(chunk)
      cb()
    }
    else if(chunk.inspect)
    {
      data = chunk.inspect(depth, context)
    }
    else
    {
      data = chunk.data
      data = isBuffer(data) ? data.toString() : data;
    }

    this.push(data);
    cb()
  }
}
util.inherits(InspectStream, stream.Transform)


exports.decodeArguments = decodeArguments
exports.filesStream     = filesStream

exports.InspectStream   = InspectStream
