#!/usr/bin/env node

var minimist = require('minimist');


function date()
{
  var args = arguments[0] && arguments[0].constructor === Object
           ? arguments[0] : minimist(arguments)

  return new Date()
}


module.exports = date;


if(!module.parent)
{
  date(process.argv.slice(2))
}
