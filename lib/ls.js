#!/usr/bin/env node


var constants = require('constants');
var path      = require('path');

var extname  = path.extname
var basename = path.basename

var glob      = require('glob');
var minimist  = require('minimist');

var _common = require('./_common')

var inspectArray    = _common.inspectArray
var decodeArguments = _common.decodeArguments


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
  if(file.isFile())      return 'fi'
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


/**
 * @return {Array}
 */
function ls()
{
  //
  // Process arguments
  //

  var args = decodeArguments(arguments)

  var paths = args._
  if(!paths.length) paths = ['.']

  if(args.A) args['almost-all'] = true
  if(args.l) args.long = true
  if(args.F) args.classify = true
  if(args.R) args.recursive = true


  function inspectFile(depth, context)
  {
    var type = classify(this)

    var result = '';

    // Long list
    if(args.long)
      result += this.mode+' '+this.nlink                 +' '+
                this.uid +' '+this.gid                   +' '+
                this.size+' '+this.mtime.toLocaleString()+' '

    // Color
    result += lsColor(this.name, type)

    // Classify
    if(args.classify)
      switch(type)
      {
        case 'di': result += '/'; break;
//        case 'do': result += '>'; break;
        case 'ex': result += '*'; break;
        case 'li': result += '@'; break;
        case 'pi': result += '|'; break;
        case 'so': result += '='; break;
      }

    return result
  }


  var result = [];


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

    Object.defineProperty(file, 'inspect', {value: inspectFile});

    result.push(file);
    return true;
  }


  //
  // Process paths
  //

  paths.forEach(function(path)
  {
    var filenames = glob.sync(path)

    if(filenames.length)
      filenames.forEach(function(file)
      {
        var stats = fs.lstatSync(path);

        if(stats.isFile())
        {
          stats.name = path;
          pushFile(stats, path);
        }

        else if(stats.isDirectory())
        {
          // Iterate over path contents
          fs.readdirSync(path).forEach(function(file)
          {
            var stats = fs.lstatSync(path + '/' + file);
            stats.name = file;

            if(!pushFile(stats, path)) return;

            // Recursive?
            if(args.recursive && stats.isDirectory())
            {
              args._ = [path+'/'+file]
              result = result.concat(ls(args));
            }
          });
        }
      });
    else
    {
      var error = new Error('no such file or directory: ' + path)
          error.path = path

      result.push(error);
    }
  });


  Object.defineProperty(result, 'inspect', {value: inspectArray})

  return result;
}


module.exports = ls;


if(!module.parent)
{
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
