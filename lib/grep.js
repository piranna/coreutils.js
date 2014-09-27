#!/usr/bin/env node

var Transform = require('stream').Transform

var inherits = require('inherits')

var _common = require('./_common');


var decodeArguments = _common.decodeArguments;
var filesStream     = _common.filesStream;

var InspectStream   = _common.InspectStream;


function GrepStream(args)
{
  if(!(this instanceof GrepStream)) return new GrepStream(args);

  GrepStream.super_.call(this, {objectMode: true});


  var flags = ''
  if(args['ignore-case']) flags += 'i'

  var regex = new RegExp(args.regexp, flags)


  function inspect(depth, context)
  {
    var result = ''

    //    if(args['files-with-matches']) return file

    result += this.data

    return result
  }

  this._transform = function(chunk, encoding, cb)
  {
    var line = chunk.data.toString()

    if(args['invert-match'] == line.match(regex)) return cb()

    Object.defineProperty(chunk, 'inspect', {value: inspect});

    this.push(chunk);
    cb()
  }
}
inherits(GrepStream, Transform)


/**
 * @return {Readable}
 */
function grep()
{
  //
  // Process arguments
  //

  var args = decodeArguments(arguments)

  var files = args._

  // Matcher Selection
  args['extended-regexp'] = args['extended-regexp'] || args.E;
  args['fixed-strings']   = args['fixed-strings']   || args.F;
  args['basic-regexp']    = args['basic-regexp']    || args.G;
  args['perl-regexp']     = args['perl-regexp']     || args.P;

  // Matching Control
  args['regexp']       = args['regexp']       || args.e;
  args['file']         = args['file']         || args.f;
  args['ignore-case']  = args['ignore-case']  || args.i || args.y;
  args['invert-match'] = args['invert-match'] || args.v;
  args['word-regexp']  = args['word-regexp']  || args.w;
  args['line-regexp']  = args['line-regexp']  || args.x;

  // General Output Control
  args['count'] = args['count'] || args.c;
  args['color'] = args['color'] || args['colour'];
  args['files-without-match'] = args['files-without-match'] || args.L;
  args['files-with-matches']  = args['files-with-matches']  || args.l;
  args['max-count']     = args['max-count']     || args.c;
  args['only-matching'] = args['only-matching'] || args.o;
  args['quiet']         = args['quiet']         || args['silent']  || args.q;
  args['no-messages']   = args['no-messages']   || args.s;

  // Output Line Prefix Control

  // Context Line Control

  // File and Directory Selection

  // Other Options
  args['line-buffered'] = args['line-buffered'] || false;
  args['binary']        = args['binary']        || args.U;
  args['null-data']     = args['null-data']     || args.z;


  if(!args['regexp']) args['regexp'] = files.shift()


  var result = filesStream(files).pipe(GrepStream(args))

  Object.defineProperty(result, 'type',
                        {value: 'scheme=coreutils.grep'});

  return result
}


module.exports = grep;
grep.GrepStream = GrepStream;


if(!module.parent)
{
  var result = grep(process.argv.slice(2))

  result.pipe(InspectStream()).pipe(process.stdout)
}
