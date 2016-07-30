const strictEqual = require('assert').strictEqual

const yes = require('..').yes


describe('yes', function()
{
  it('no argumens', function(done)
  {
    yes()
    .on('error', done)
    .on('data', function(data)
    {
      strictEqual(data.toString(), 'y')

      this.push(null)
    })
    .on('end', done)
  })

  it('use a string argument', function(done)
  {
    const expected = 'asdf'

    yes(expected)
    .on('error', done)
    .on('data', function(data)
    {
      strictEqual(data.toString(), expected)

      this.push(null)
    })
    .on('end', done)
  })
})
