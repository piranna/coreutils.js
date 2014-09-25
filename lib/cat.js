#!/usr/bin/env node

var Transform = require('stream').Transform

var inherits = require('inherits')

var _common = require('./_common');


var decodeArguments = _common.decodeArguments;
var filesStream     = _common.filesStream;

var InspectStream   = _common.InspectStream;


function CatStream(args)
{
  if(!(this instanceof CatStream)) return new CatStream(args);

  CatStream.super_.call(this, {objectMode: true});


  var numLine = 1
  var squeezed = false

  this._transform = function(chunk, encoding, cb)
  {
    var line = chunk.data

    if(args['squeeze-blank'] && line === '')
    {
      if(squeezed) return cb()

      squeezed = true
    }
    else
      squeezed = false

    if(line || args['number'] != 'number-nonblank')
      chunk.numLine = numLine++

    function inspectCat()
    {
      var result = ''

      if(args['number']) result += ('      '+this.numLine).slice(-6)+'\t'

      result += this.data

      // [ToDo] show-nonprinting
//      if(args['show-nonprinting']) result += result.replace('\t', '^I')

      if(args['show-tabs']) result += result.replace('\t', '^I')
      if(args['show-ends']) result += '$'

      return result
    }

    Object.defineProperty(chunk, 'inspect', {value: inspectCat});

    this.push(chunk);
    cb()
  }
}
inherits(CatStream, Transform)


/**
 * @return {Readable}
 */
function cat()
{
  var args = decodeArguments(arguments)

  var files = args._

  if(args.A || args['show-all'])
  {
    args['show-nonprinting'] = true
    args['show-ends'] = true
    args['show-tabs'] = true
  }
  if(args.e)
  {
    args['show-nonprinting'] = true
    args['show-ends'] = true
  }
  if(args.t)
  {
    args['show-nonprinting'] = true
    args['show-tabs'] = true
  }

  if(args.n || args['number'])          args['number'] = 'number'
  if(args.b || args['number-nonblank']) args['number'] = 'number-nonblank'

  if(args.E) args['show-ends']        = true
  if(args.s) args['squeeze-blank']    = true
  if(args.T) args['show-tabs']        = true
  if(args.v) args['show-nonprinting'] = true


  var result = filesStream(files).pipe(CatStream(args))

  Object.defineProperty(result, 'type',
                        {value: 'Object; scheme=coreutils.cat'});

  return result
}


module.exports = cat;
cat.CatStream = CatStream;


if(!module.parent)
{
  var result = cat(process.argv.slice(2))

  result.pipe(InspectStream()).pipe(process.stdout)
}
