#!/usr/bin/env node


var fs = require('fs')
var Readable = require('stream').Readable

var eachSeries = require('async').eachSeries;
var inherits = require('inherits')

var constants = require('constants');
var path      = require('path');

var extname  = path.extname
var basename = path.basename

var glob      = require('glob');
var minimist  = require('minimist');

var _common = require('./_common')

var decodeArguments = _common.decodeArguments

var InspectStream   = _common.InspectStream;


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


function ls()
{
  if(!(this instanceof ls))
  {
    var that = Object.create(ls.prototype);
    ls.apply(that, arguments);
    return that;
  }

  ls.super_.call(this, {objectMode: true});


  var self = this;


  var args = decodeArguments(arguments)

  args.paths = args._.length ? args._ : ['.'];

  if(args.g) args.l = true
  if(args.o) args.l = true

  args['almost-all'] = args['almost-all'] || args.A
  args["classify"]   = args["classify"]   || args.F
  args["quote-name"] = args["quote-name"] || args.Q
  args["recursive"]  = args["recursive"]  || args.R


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

    if(args.l)
      result += '\n'
    else
      result += '  '

    return result
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

    self.push(file);
    return true;
  }

  function pushError(error)
  {
    self.push(error);
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
                  pushError);
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
          pushError);

        else
        {
          var error = new Error('no such file or directory: '+path)
              error.path = path

          pushError(error);
        }

//        callback();
      })
    },
    pushError);
  }

  ls_priv(args)
}
inherits(ls, Readable)

ls.prototype._read = function(size){};

Object.defineProperty(ls.prototype, 'type',
                      {value: 'scheme=coreutils.ls'});


module.exports = ls;


if(!module.parent)
{
  var result = ls(process.argv.slice(2))

  result.pipe(InspectStream()).pipe(process.stdout)

  return  // Testing


  try
  {
    var result = ls(process.argv.slice(2))
  }
  catch(e)
  {
    console.error(e)
    process.exit(2)
  }

  var warnings = false
  result.forEach(function(line)
  {
    if(line instanceof Error)
    {
      warnings = true
      return console.warning(line)
    }
  })

  console.log(result.inspect())

  if(warnings)
    process.exit(1)
}
