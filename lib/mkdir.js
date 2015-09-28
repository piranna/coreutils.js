var fs    = require('fs');
var path  = require('path');


var decodeArguments = require('./common').decodeArguments 

var mkdir = function (path) {
  var args = decodeArguments(arguments)
  
  if(args.p || args['possible']) {
    //add "mkdir -p" stuff 
  }
  try {
    fs.mkdirSync(path);
  } catch(e) {
    if ( e.code != 'EEXIST' ) throw e;
  }
}

exports.mkdir = mkdir 
