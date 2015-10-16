var fs    = require('fs-extra');
var path  = require('path');


var decodeArguments = require('./common').decodeArguments 

var mkdir = function (path) {
  var args = decodeArguments(arguments)
  
  if(args.p || args['possible']) {
   try{
     fs.mkdirs(path);
   } catch(e) {
     if (e.code != 'EEXIST') throw e;
   }
  } else {
   try {
     fs.mkdirSync(path);
   } catch(e) {
     if ( e.code != 'EEXIST' ) throw e;
    }
  }

exports.mkdir = mkdir 
