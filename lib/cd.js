var fs   = require('fs');
var path = require('path');


function cd(dir)
{
  var env = process.env

  if (!dir) dir = env.HOME;

  dir.replace(/^~\//, function()
  {
    return env.HOME + '/'
  });
  dir = path.resolve(env.PWD, dir);

  if (!fs.existsSync(dir))
    throw 'no such file or directory: ' + dir;

  if (!fs.statSync(dir).isDirectory())
    throw 'not a directory: ' + dir;

  process.chdir(dir);
  env.PWD = dir;
}


module.exports = cd;
