'use strict'

const fs     = require('fs')
const isatty = require('tty').isatty
const util   = require('util')

const posix = require('posix')



const BIT_STICKY = parseInt('1000', 8)
const BIT_SETGID = parseInt('2000', 8)
const BIT_SETUID = parseInt('4000', 8)


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
  const tokens = arguments[0] instanceof Array ? arguments[0] : Array.from(arguments)


  var parenthesis = 0

  function decode()
  {
    var result = false

    while(tokens.length)
    {
      var token = tokens.shift()

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
        case '-o': if( result) return result; break

        case  '=': case '-eq': result = result === decode(); break
        case '!=': case '-ne': result = result !== decode(); break

        case '-ge': result = result >= decode(); break
        case '-gt': result = result >  decode(); break
        case '-le': result = result <= decode(); break
        case '-lt': result = result <  decode(); break

        case '-ef': result = sameDeviceInode(result, decode()); break
        case '-nt': result = newer(result, decode()); break
        case '-ot': result = older(result, decode()); break

        case '-b': result = blockSpecial(tokens.shift())         ; break
        case '-c': result = characterSpecial(tokens.shift())     ; break
        case '-d': result = directory(tokens.shift())            ; break
        case '-e': result = exists(tokens.shift())               ; break
        case '-f': result = regularFile(tokens.shift())          ; break
        case '-g': result = setGroupIDbit(tokens.shift())        ; break
        case '-G': result = ownedEffectiveGroupID(tokens.shift()); break
        case '-h':
        case '-L': result = symbolicLink(tokens.shift())         ; break
        case '-k': result = stickyBit(tokens.shift())            ; break
        case '-l': result = stringLength(tokens.shift())         ; break
        case '-n': result = stringLengthNonZero(tokens.shift())  ; break
        case '-O': result = ownedEffectiveUserID(tokens.shift()) ; break
        case '-p': result = namedPipe(tokens.shift())            ; break
        case '-r': result = readPermission(tokens.shift())       ; break
        case '-s': result = sizeGreaterThanZero(tokens.shift())  ; break
        case '-S': result = socket(tokens.shift())               ; break
        case '-t': result = openedOnTerminal(tokens.shift())     ; break
        case '-u': result = setUserIDbit(tokens.shift())         ; break
        case '-w': result = writePermission(tokens.shift())      ; break
        case '-x': result = executePermission(tokens.shift())    ; break
        case '-z': result = stringLengthZero(tokens.shift())     ; break

        default: result = stringLengthNonZero(token)
      }
    }

    if(parenthesis != 0) throw "Unbalanced parenthesis"

    return result
  }

  return decode()
}


module.exports = test
