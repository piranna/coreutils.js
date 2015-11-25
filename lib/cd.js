var path = require('path');


function cd(dir)
{
  var env = process.env

  if (!dir) dir = env.HOME;
  if (dir === '-') dir = env.OLDPWD;

  dir.replace(/^~\//, env.HOME+'/');
  dir = path.resolve(env.PWD, dir);

  process.chdir(dir);
  env.OLDPWD = env.PWD;
  env.PWD = dir;
}


module.exports = cd;
