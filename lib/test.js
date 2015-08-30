var util = require('util')

var posix = require('posix');


const BIT_STICKY = 0o1000
const BIT_SETGID = 0o2000
const BIT_SETUID = 0o4000


function blockSpecial(file)
{
  return fs.statSync(path).isBlockDevice()
}
function characterSpecial(file)
{
  return fs.statSync(path).isCharacterDevice()
}
function directory(file)
{
  return fs.statSync(path).isDirectory()
}
function ownedEffectiveGroupID(file)
{
  return fs.statSync(path).gid === posix.getegid()
}
function ownedEffectiveUserID(file)
{
  return fs.statSync(path).uid === posix.geteuid()
}
function executePermission(file)
{
  return fs.accessSync(path, fs.X_OK)
}
function exists(file)
{
  return fs.existsSync(file)
}
function namedPipe(file)
{
  return fs.statSync(path).isFIFO()
}
function openedOnTerminal(fd)
{

}
function readPermission(file)
{
  return fs.accessSync(path, fs.R_OK)
}
function regularFile(file)
{
  return fs.statSync(path).isFile()
}
function setGroupIDbit(file)
{
  return fs.statSync(path).mode & BIT_SETGID
}
function setUserIDbit(file)
{
  return fs.statSync(path).mode & BIT_SETUID
}
function sizeGreaterThanZero(file)
{
  return fs.statSync(path).size > 0
}
function socket(file)
{
  return fs.statSync(path).isSocket()
}
function stickyBit(file)
{
  return fs.statSync(path).mode & BIT_STICKY
}
function stringLength(string)
{
  return string.length
}
function stringLengthNonZero(string)
{
  return !stringLengthZero(string)
}
function stringLengthZero(string)
{
  return stringLength(string) === 0
}
function symbolicLink(file)
{
  return fs.lstatSync(path).isSymbolicLink()
}
function writePermission(file)
{
  return fs.accessSync(path, fs.W_OK)
}


function test()
{
  var index = 0

  function negation()
  {
    return decode()
  }

  function decode()
  {
    while(index < arguments.length)
    {
      var token = arguments[index++]

      switch(token)
      {
        case '!': return negation()
        case '(':
          var result = decode()
          if(arguments[index++] !== ')') throw "Unbalanced parenthesis"
          return result

        case '-b': return blockSpecial(arguments[index++])
        case '-c': return characterSpecial(arguments[index++])
        case '-d': return directory(arguments[index++])
        case '-e': return exists(arguments[index++])
        case '-f': return regularFile(arguments[index++])
        case '-g': return setGroupIDbit(arguments[index++])
        case '-G': return ownedEffectiveGroupID(arguments[index++])
        case '-h':
        case '-L': return symbolicLink(arguments[index++])
        case '-k': return stickyBit(arguments[index++])
        case '-l': return stringLength(arguments[index++])
        case '-n': return stringLengthNonZero(arguments[index++])
        case '-O': return ownedEffectiveUserID(arguments[index++])
        case '-p': return namedPipe(arguments[index++])
        case '-r': return readPermission(arguments[index++])
        case '-s': return sizeGreaterThanZero(arguments[index++])
        case '-S': return socket(arguments[index++])
        case '-t': return openedOnTerminal(arguments[index++])
        case '-u': return setUserIDbit(arguments[index++])
        case '-w': return writePermission(arguments[index++])
        case '-x': return executePermission(arguments[index++])
        case '-z': return stringLengthZero(arguments[index++])

        default: return stringLengthNonZero(token)
      }
    }
  }

  return decode()
}


module.exports = test;
