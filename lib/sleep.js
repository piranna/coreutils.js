const execFileSync = require('child_process').execFileSync


function sleep()
{
  arguments = arguments[0] instanceof Array ? arguments[0] : Array.from(arguments)

  execFileSync(__dirname+'/../bin/sleep.js', arguments)
}


module.exports = sleep
