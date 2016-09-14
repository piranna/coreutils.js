var Transform = require('stream').Transform

var inherits = require('inherits')

var common = require('./common')

var decodeArguments = common.decodeArguments
var filesStream     = common.filesStream

var crcTable = require('./crctable.json')

function Cksum(args)
{
  if(!(this instanceof Cksum)) return new Cksum(args)

  args = args || {}
  args.objectMode = true

  Cksum.super_.call(this, args)

  var bytes
  var filename
  var cksum

  function init() {
    bytes = 0
    filename = ''
    cksum = 0
  }

  var push = ()=>{
    for (var n=bytes; n>0; n>>>=8) {
      var byte = n & 0xFF
      sum(byte)
    }
    var chunk = {bytes, cksum:~cksum>>>0, filename}
    Object.defineProperty(chunk, 'inspect', {value: inspectCksum})
    this.push(chunk)
  }

  function inspectCksum()
  {
    return (this.cksum + ' ' + this.bytes + ' ' + this.filename + '\n')
  }

  function sum(byte)
  {
    cksum = (cksum << 8) ^ crcTable[(cksum >>> 24) ^ byte]
  }

  init()

  this._transform = function(chunk, encoding, cb)
  {
    if (filename && filename !== chunk.file) {
      push()
      init()
    }

    filename = chunk.file
    bytes += chunk.data.length

    for (var i=0; i<chunk.data.length; i++) {
      var byte = chunk.data.charCodeAt(i)
      sum(byte)
    }
    cb()
  }

  this._flush = function(cb) {
    push()
  }
}
inherits(Cksum, Transform)

Object.defineProperty(Cksum.prototype, 'type', {value: 'scheme=coreutils.cksum'})

function cksum()
{
  var args = decodeArguments(arguments)

  var files = args._

  return filesStream(files).pipe(Cksum(args))
}

cksum.Cksum = Cksum

module.exports = cksum

/* vim: set et ts=2 sw=2: */
