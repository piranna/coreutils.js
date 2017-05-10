const mkdir = require('fs').mkdir

const each   = require('async/each')
const mkdirp = require('mkdirp')

const decodeArguments = require('./common').decodeArguments


function Mkdir(args)
{
  if(!(this instanceof Mkdir)) return new Mkdir(args)

  Mkdir.super_.call(this, {objectMode: true})


  const mode    = args['mode']
  const parents = args['parents']
  const verbose = args['verbose']


  function createDirs(path, done)
  {
    function callback(error)
    {
      if(error && error.code !== 'EEXIST') return done(error)

      if(verbose) this.push(path)

      done()
    }

    (parents ? mkdirp : mkdir)(path, mode, callback)
  }


  // TODO We'll need to check is stream should close after them or keep open
  each(args._, createDirs)


  this._transform = function(path, encoding, done)
  {
    createDirs(path, done)
  }
}
inherits(Mkdir, Transform)

Object.defineProperty(Mkdir.prototype, 'type', {value: 'scheme=coreutils.mkdir'});


function mkdir()
{
  const args = decodeArguments(arguments)

  args['mode'   ] = args['mode'   ] || args.m || 0o777
  args['parents'] = args['parents'] || args.p
  args['verbose'] = args['verbose'] || args.v

  return Mkdir(args)
}


exports.mkdir = mkdir
