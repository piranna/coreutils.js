const strictEqual = require('assert').strictEqual

const test = require('..').test


describe('test', function()
{
  it('return `false` with no argument', function()
  {
    const result = test()

    strictEqual(result, false)
  })
})
