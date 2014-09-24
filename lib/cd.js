var path = require('path');


function cd(dir)
{
  var env = process.env

  if (!dir) dir = env.HOME;

  dir.replace(/^~\//, env.HOME+'/');
  dir = path.resolve(env.PWD, dir);

  process.chdir(dir);
  env.PWD = dir;
}


module.exports = cd;
