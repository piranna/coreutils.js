'use strict'

const path     = require('path')
const Readable = require('stream').Readable
const resolve  = require('path').resolve


function noop(){}


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


  var result = new Readable({objectMode: true})
      result._read = noop

  var dir = argv[0] || env.HOME

  var showNewPwd = false
  if(dir === '-')
  {
    dir = env.OLDPWD

    if(!dir)
    {
      result.emit('error', 'cd: OLDPWD not defined\n')

      result.push(null)
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

    result.push(null)
    return result
  }

  env.OLDPWD = env.PWD
  env.PWD = dir

  if(showNewPwd)
  {
    dir = new String(dir+'\n')
    dir.type = 'cd'

    result.push(dir)
  }

  result.push(null)
  return result
}


module.exports = cd;
