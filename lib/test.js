var isatty = require('tty').isatty
var util   = require('util')

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
  return isatty(fd)
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

function newer(file1, file2)
{
  return fs.statSync(file1).mtime.getTime() > fs.statSync(file2).mtime.getTime()
}
function older(file1, file2)
{
  return fs.statSync(file1).mtime.getTime() < fs.statSync(file2).mtime.getTime()
}
function sameDeviceInode(file1, file2)
{
  file1 = fs.statSync(file1)
  file2 = fs.statSync(file2)

  return file1.dev === file2.dev && file1.ino === file2.ino
}


function test()
{
  var index = 0
  var parenthesis = 0

  function decode()
  {
    var result = false

    while(index < arguments.length)
    {
      var token = arguments[index++]

      switch(token)
      {
        case '!': result = !decode(); break

        case '(':
          parenthesis++
          result = decode(); break
        case ')':
          if(--parenthesis<0) throw "Unbalanced parenthesis underflow"
          return result

        case '-a': if(!result) return result; break
        case '-0': if( result) return result; break

        case '=' : case '-eq': result = result === decode(); break
        case '!=': case '-ne': result = result !== decode(); break

        case '-ge': result = result >= decode(); break
        case '-gt': result = result >  decode(); break
        case '-le': result = result <= decode(); break
        case '-lt': result = result <  decode(); break

        case '-ef': result = sameDeviceInode(result, decode()); break
        case '-nt': result = newer(result, decode()); break
        case '-ot': result = older(result, decode()); break

        case '-b': result = blockSpecial(arguments[index++])         ; break
        case '-c': result = characterSpecial(arguments[index++])     ; break
        case '-d': result = directory(arguments[index++])            ; break
        case '-e': result = exists(arguments[index++])               ; break
        case '-f': result = regularFile(arguments[index++])          ; break
        case '-g': result = setGroupIDbit(arguments[index++])        ; break
        case '-G': result = ownedEffectiveGroupID(arguments[index++]); break
        case '-h':
        case '-L': result = symbolicLink(arguments[index++])         ; break
        case '-k': result = stickyBit(arguments[index++])            ; break
        case '-l': result = stringLength(arguments[index++])         ; break
        case '-n': result = stringLengthNonZero(arguments[index++])  ; break
        case '-O': result = ownedEffectiveUserID(arguments[index++]) ; break
        case '-p': result = namedPipe(arguments[index++])            ; break
        case '-r': result = readPermission(arguments[index++])       ; break
        case '-s': result = sizeGreaterThanZero(arguments[index++])  ; break
        case '-S': result = socket(arguments[index++])               ; break
        case '-t': result = openedOnTerminal(arguments[index++])     ; break
        case '-u': result = setUserIDbit(arguments[index++])         ; break
        case '-w': result = writePermission(arguments[index++])      ; break
        case '-x': result = executePermission(arguments[index++])    ; break
        case '-z': result = stringLengthZero(arguments[index++])     ; break

        default: result = stringLengthNonZero(token)
      }
    }

    if(parenthesis != 0) throw "Unbalanced parenthesis"

    return result
  }

  return decode()
}


module.exports = test
