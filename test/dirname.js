const strictEqual = require('assert').strictEqual

const concat = require('concat-stream')

const dirname = require('..').dirname


describe('dirname', function()
{
  xit('error when not giving paths', function(done)
  {
    const expected = 'asdf'

    dirname(expected)
    .on('error', done)
    .pipe(concat(function(data)
    {
      strictEqual(data.toString(), expected+'\n')

      done()
    }))
  })

  it('single file', function(done)
  {
    dirname('test')
    .on('error', done)
    .on('data', function(data)
    {
      strictEqual(data.toString(), '.')

      done()
    })
  })
})
