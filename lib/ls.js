var fs       = require('fs')
var Readable = require('stream').Readable

var constants  = require('constants');
var eachSeries = require('async').eachSeries;
var glob       = require('glob');
var inherits   = require('inherits')
var minimist   = require('minimist');

var path     = require('path');
var extname  = path.extname
var basename = path.basename


var common = require('./common')

var decodeArguments = common.decodeArguments

var InspectStream   = common.InspectStream;


const S_IX = constants.S_IXUSR
           | constants.S_IXGRP
           | constants.S_IXOTH


function classify(file)
{
  // Devices
  if(file.isBlockDevice())     return 'bd'
  if(file.isCharacterDevice()) return 'cd'

  // Straighforward types
  if(file.isDirectory()) return 'di'
//  if(file.isDoor())      return 'do'  // SolarisOS
  if(file.isFIFO())      return 'pi'
  if(file.isSocket())    return 'so'

  // Simbolic links
  if(file.isSymbolicLink())
  {
    // ToDo: orphan and missing links
    return 'ln'
  }

  // Executable
  if(file.mode & S_IX) return 'ex'

  // By default, return 'file' class
  return 'fi'
}

function lsColor(str, type)
{
  var colors = {}

  process.env['LS_COLORS'].split(':')
  .forEach(function(color)
  {
    color = color.split('=')

    var key = color[0]
    if(key[0] == '*')  // file extension
       key = key.substr(1);

    colors[key] = color[1]
  })

  // Get color from extension
  var color = colors[extname(str)]
  if(color)
    return '\x1b['+color+'m' + str + '\x1b[0m'

  // Get color from filetype
  var color = colors[type]
  if(color)
    return '\x1b['+color+'m' + str + '\x1b[0m'

  // Unknown file, default color
  return str
}


function Ls(args)
{
  if(!(this instanceof Ls)) return new Ls(args)

  Ls.super_.call(this, {objectMode: true});


  var self = this

  var push = this.push.bind(this)


  function inspect(depth, context)
  {
    var type = classify(this)

    var result = '';

    // Long list
    if(args.l)
    {
      result += this.mode+' '+this.nlink+' '

      if(!args.g) result += this.uid+' '
      if(!args.o) result += this.gid+' '

      result += this.size+' '+this.mtime.toLocaleString()+' '
    }

    // Color
    var name = args["quote-name"] ? '"'+this.name+'"' : this.name
    result += lsColor(name, type)

    // Classify
    if(args["classify"])
      switch(type)
      {
        case 'di': result += '/'; break;
//        case 'do': result += '>'; break;
        case 'ex': result += '*'; break;
        case 'li': result += '@'; break;
        case 'pi': result += '|'; break;
        case 'so': result += '='; break;
      }

    return result + (args.l ? '\n' : '  ')
  }

  function pushFile(file, query)
  {
    // hidden file?
    if(basename(file.name)[0] === '.')
    {
      // not explicitly asking for hidden files?
      if(!args['almost-all']
      && !(basename(query)[0] === '.'
        && basename(query).length > 1))
        return false;
    }

    Object.defineProperty(file, 'inspect', {value: inspect});

    push(file);
    return true;
  }

  function ls_priv(args)
  {
    eachSeries(args.paths, function(path, callback)
    {
      glob(path, function(err, matches)
      {
        if(err) return callback(err)

        if(matches.length)
          eachSeries(matches, function(file, callback)
          {
            fs.lstat(path, function(err, stats)
            {
              if(err) return callback(err)

              if(stats.isDirectory())
              {
                // Iterate over path contents
                fs.readdir(path, function(err, files)
                {
                  if(err) return callback(err)

                  eachSeries(files, function(file, callback)
                  {
                    fs.lstat(path + '/' + file, function(err, stats)
                    {
                      if(err) return callback(err)

                      stats.name = file;

                      if(pushFile(stats, path))
                      {
                        // Recursive?
                        if(args.recursive && stats.isDirectory())
                        {
                          args._ = [path+'/'+file]
                          ls_priv(args);
                        }
                      };

                      callback();
                    });
                  },
                  push);
                })
              }

              else
              {
                stats.name = path;

                pushFile(stats, path);
              }

//              callback();
            });
          },
          push);

        else
        {
          var error = new Error('no such file or directory: '+path)
              error.path = path

          push(error);
        }

//        callback();
      })
    },
    push);
  }

  ls_priv(args)
}
inherits(Ls, Readable)

// [ToDo] Implement correct stream control, maybe need to use generators
Ls.prototype._read = function(size){};

Object.defineProperty(Ls.prototype, 'type', {value: 'scheme=coreutils.ls'});


function ls()
{
  var args = decodeArguments(arguments)

  args.paths = args._.length ? args._ : ['.'];

  if(args.g) args.l = true
  if(args.o) args.l = true

  args['almost-all'] = args['almost-all'] || args.A
  args["classify"]   = args["classify"]   || args.F
  args["quote-name"] = args["quote-name"] || args.Q
  args["recursive"]  = args["recursive"]  || args.R


  return Ls(args)
}

ls.Ls = Ls


module.exports = ls
