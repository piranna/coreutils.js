#!/usr/bin/env node

var fs = require('fs')

var minimist = require('minimist');


function readStdin(stdin)
{
  if(typeof stdin == 'string') return stdin

  if(stdin instanceof Array) return stdin.join()

  if(!stdin || stdin == global) stdin = process.stdin

  return fs.readFileSync(stdin.fd).toString()
}


function cat()
{
  //
  // Process arguments
  //

  var args = arguments[0] && arguments[0].constructor === Object
           ? arguments[0] : minimist(arguments)

  var files = args._
  if(!files.length) blah()

  if(args.A || args['show-all'])
  {
    args['show-nonprinting'] = true
    args['show-ends'] = true
    args['show-tabs'] = true
  }
  if(args.e)
  {
    args['show-nonprinting'] = true
    args['show-ends'] = true
  }
  if(args.t)
  {
    args['show-nonprinting'] = true
    args['show-tabs'] = true
  }

  if(!args._number && (args.n || args['number'])) args._number = 'number'
  if(args.b || args['number-nonblank']) args._number = 'number-nonblank'

  if(args.E) args['show-ends'] = true
  if(args.s) args['squeeze-blank'] = true
  if(args.T) args['show-tabs'] = true
  if(args.v) args['show-nonprinting'] = true


  //
  // Process files
  //

  if(files.length)
    return files.forEach(function(file)
    {
      if(file == '-')
        return readStdin(this)

      return fs.readFileSync(file)
    }, this).join()

  return readStdin(this)
}


module.exports = cat;


if(!module.parent)
{
  cat.apply(process.stdin, process.argv.slice(2))
}
