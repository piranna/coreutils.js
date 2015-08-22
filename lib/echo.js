var decodeArguments = require('./common').decodeArguments;


/**
 * @return {String}
 */
function echo()
{
  //
  // Process arguments
  //
  var args = decodeArguments(arguments)

  var result = args._.join(' ');
  if (!args.n) result += '\n';


  //
  // Process files
  //

  return result
}


module.exports = echo;
