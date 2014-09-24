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

  var number;
  if(args.n || args['number']) number = 'number'
  if(args.b || args['number-nonblank']) number = 'number-nonblank'

  if(args.E) args['show-ends']        = true
  if(args.s) args['squeeze-blank']    = true
  if(args.T) args['show-tabs']        = true
  if(args.v) args['show-nonprinting'] = true


  //
  // Process files
  //

  var counter = 1
  var squeezed = false

  function processLine(line)
  {
    var result = {}

    if(args['squeeze-blank'] && line == '')
    {
      if(squeezed) return

      squeezed = true
    }
    else
      squeezed = false

    if(line != '' || number != 'number-nonblank')
      result.numLine = counter++

    // inspect

    function inspectCat()
    {
      var result = ''

      if(number)            result += ('      '+this.numLine).slice(-6)+'\t'

      result += line

      // [ToDo] show-nonprinting
//      if(args['show-nonprinting']) result += result.replace('\t', '^I')

      if(args['show-tabs']) result += result.replace('\t', '^I')
      if(args['show-ends']) result += '$'



      return result
    }

    Object.defineProperty(result, 'inspect', {value: inspectCat});

    return result
  }


  return processStream(processLine, files)
}


module.exports = cat;


if(!module.parent)
{
  var result = cat(process.argv.slice(2))

  result.on('data', console.log.bind(console))
}
