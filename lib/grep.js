#!/usr/bin/env node

var _common = require('./_common');


var decodeArguments = _common.decodeArguments;
var processLines    = _common.processLines;


/**
 * @return {Readable}
 */
function grep()
{
  //
  // Process arguments
  //

  var args = decodeArguments(arguments)

  var files = args._

  if(args.e && !args.regexp) args.regexp = args.e;
  if(args.i) args['ignore-case'] = true;
  if(args.v) args['invert-match'] = true;

  if(args.f && !args.file) args.file = args.f;

  if(!args.regexp) args.regexp = files.shift()


  //
  // Process lines
  //

  var flags = args['ignore-case'] ? 'i' : ''
  var regex = new RegExp(args.regexp, flags)
  var matched = line.match(regex);

  function processLine(line)
  {
    if(args['invert-match'] == matched) return

    // inspect

    return line
  }


  return processLines(processLine, files)
}


module.exports = grep;


if(!module.parent)
{
  var result = grep(process.argv.slice(2))

  result.on('data', console.log.bind(console))
}
