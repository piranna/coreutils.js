#!/usr/bin/env node

var fs = require('fs')

var _common = require('./_common');


var decodeArguments = _common.decodeArguments;
var processLines    = _common.processLines;


/**
 * @return {Readable}
 */
function cat()
{
  //
  // Process arguments
  //

  var args = decodeArguments(arguments)

  var files = args._

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

  if(args.E) args['show-ends']        = true
  if(args.s) args['squeeze-blank']    = true
  if(args.T) args['show-tabs']        = true
  if(args.v) args['show-nonprinting'] = true


  //
  // Process files
  //

  var squeezed = false

  function processLine(line)
  {
    if(args['squeeze-blank'] && line == '')
    {
      if(squeezed) return

      squeezed = true
      return ''
    }
    squeezed = false

    // inspect

    if(args['show-tabs']) line = line.replace('\t', '^I')
    if(args['show-ends']) line += '$'

    return line
  }


  return processLines(processLine, files)
}


module.exports = cat;


if(!module.parent)
{
  var result = cat(process.argv.slice(2))

  result.on('data', console.log.bind(console))
}
