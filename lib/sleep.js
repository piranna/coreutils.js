var execFileSync = require('child_process').execFileSync


function sleep()
{
  if(arguments[0] instanceof Array) arguments = arguments[0]

  execFileSync(__dirname+'/../bin/sleep.js', arguments)
}


module.exports = sleep
