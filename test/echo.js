const strictEqual = require('assert').strictEqual

const concat = require('concat-stream')

const echo = require('..').echo


describe('echo', function()
{
  it('simple', function(done)
  {
    const expected = 'asdf'

    echo(expected)
    .on('error', done)
    .pipe(concat(function(data)
    {
      strictEqual(data.toString(), expected+'\n')

      done()
    }))
  })
})
