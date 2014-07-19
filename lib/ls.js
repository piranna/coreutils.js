#!/usr/bin/env node


var constants = require('constants');
var path      = require('path');

var extname  = path.extname
var basename = path.basename

var glob      = require('glob');
var minimist  = require('minimist');

var improveListCommands = require('./improveListCommands.js')


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


function ls()
{
  //
  // Process arguments
  //

  var args = arguments[0] && arguments[0].constructor === Object
           ? arguments[0] : minimist(arguments)

  var paths = args._
  if(!paths.length) paths = ['.']

  if(args.A) args['almost-all'] = true
  if(args.l) args.long = true
  if(args.F) args.classify = true
  if(args.R) args.recursive = true


  function inspectFile(depth)
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


  improveListCommands(result)

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

    console.log(line)
  })

  if(warnings)
    process.exit(1)
}
