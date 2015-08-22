var Transform = require('stream').Transform

var inherits = require('inherits')

var common = require('./common');


var decodeArguments = common.decodeArguments;
var filesStream     = common.filesStream;


function Cat(args)
{
  if(!(this instanceof Cat)) return new Cat(args);

  Cat.super_.call(this, {objectMode: true});


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
inherits(Cat, Transform)

Object.defineProperty(Cat.prototype, 'type', {value: 'scheme=coreutils.cat'});


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


  return filesStream(files).pipe(Cat(args))
}

cat.Cat = Cat


module.exports = cat
