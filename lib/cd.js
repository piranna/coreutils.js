'use strict'

const path     = require('path')
const Readable = require('stream').Readable
const resolve  = require('path').resolve


function noop(){}

function emit(self, dir)
{
  if(self.ended) return

  if(dir !== null)
  {
    dir = new String(dir+'\n')
    dir.type = 'cd'
    self.push(dir)
  }

  self.push(null)
  self.ended = true
}


/**
 * @param [string[]|...string] [argv=[]]
 * @param {Object}             [env=process.env]
 */
function cd()
{
  var argv = Array.from(arguments)
  var env  = process.env

  if(argv.length)
  {
    if(argv[argv.length-1].constructor === Object)    env  = argv.pop()
    if(argv.length === 1 && argv[0] instanceof Array) argv = argv[0]
  }


  var dir = argv[0] || env.HOME

  var result = new Readable(
  {
    objectMode: true,
    read()
    {
      process.nextTick(emit, this, dir)
    }
  })

  var showNewPwd = false
  if(dir === '-')
  {
    dir = env.OLDPWD

    if(!dir)
    {
      result.emit('error', 'cd: OLDPWD not defined\n')

      dir = null
      return result
    }

    showNewPwd = true
  }

//  dir.replace(/^~\//, env.HOME+'/')
  dir = resolve(env.PWD, dir)

  try
  {
    process.chdir(dir)
  }
  catch(error)
  {
    if(error.code !== 'ENOENT') throw error

    result.emit('error', 'cd: '+dir+': no such file or directory\n')

    dir = null
    return result
  }

  env.OLDPWD = env.PWD
  env.PWD = dir

  if(!showNewPwd) dir = null

  return result
}


module.exports = cd;
