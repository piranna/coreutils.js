const mkdirSync = require('fs').mkdirSync
const path      = require('path')

const mkdirs = require('mkdirs')

const decodeArguments = require('./common').decodeArguments


function mkdir()
{
  const args = decodeArguments(arguments)

  args['mode'   ] = args['mode'   ] || args.m
  args['parents'] = args['parents'] || args.p
  args['verbose'] = args['verbose'] || args.v

  try
  {
    if(args['parents'])
      mkdirs(path)
    else
      mkdirSync(path)
  }
  catch(e)
  {
    if(e.code !== 'EEXIST') throw e
  }
}


exports.mkdir = mkdir
