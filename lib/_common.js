var stream = require('stream')

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

function readStdin(stdin)
{
  if(typeof stdin == 'string') stdin = stdin.split('\n')

  if(stdin instanceof Array)
  {
    var result = new Readable()
    var push = result.push.bind(result)

    stdin.forEach(push)
    push(null)  // end of array

    return result
  }

  if(stdin instanceof Stream) return stdin

  if(!stdin || stdin == global) return process.stdin

  throw Error('Unknown object as stdin: '+stdin)
}


function inspectArray(depth, context)
{
  return this
  .filter(function(line)
  {
    return !(line instanceof Error)
  })
  .map(function(item)
  {
    if(item.inspect)
      return item.inspect(depth, context)
    return item
  })
  .join('\n')
}


function processStream(processLine, files)
{
  var result

  if(files.length)
  {
    var streams = files.map(function(file)
    {
      if(file == '-')
        return readStdin(this)

      return fs.readFile(file)
    }, this)

    result = new OrderedReadStreams(streams)
  }
  else
    result = readStdin(this)

  return result.pipe(processLine)
}


exports.inspectArray    = inspectArray
exports.decodeArguments = decodeArguments
exports.processStream   = processStream
