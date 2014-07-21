#!/usr/bin/env node


var _common = require('./_common');

var inspectArray    = _common.inspectArray
var decodeArguments = _common.decodeArguments;
var readStdin       = _common.readStdin;


/**
 * @return {Array}
 */
function sort()
{
//
// Process arguments
//

  var args = decodeArguments(arguments)

  var files = args._

  // Ordering options

  if(args.b) args['ignore-leading-blanks'] = true;
  if(args.d) args['dictionary-order']      = true;
  if(args.f) args['ignore-case']           = true;
  if(args.g) args['general-numeric-sort']  = true;
  if(args.i) args['ignore-nonprinting']    = true;
  if(args.M) args['month-sort']            = true;
  if(args.h) args['human-numeric-sort']    = true;
  if(args.n) args['numeric-sort']          = true;
  if(args.R) args['random-sort']           = true;
  if(args.r) args['reverse']               = true;
  if(args.V) args['version-sort']          = true;

  // Other options


//
// Process files
//

  var result = []
  var push = result.push.bind(result)

  if(files.length)
    files.forEach(function(file)
    {
      if(file == '-')
        file = readStdin(this)
      else
        file = fs.readFileSync(file).split('\n')

      file.forEach(push)
    }, this).join()
  else
    readStdin(this).forEach(push)

  result.sort()

  if(args.reverse) result.reverse()


  Object.defineProperty(result, 'inspect', {value: inspectArray})

  return result
}


module.exports = sort;


if(!module.parent)
{
  var result = sort(process.argv.slice(2))

  console.log(result.inspect())
}
