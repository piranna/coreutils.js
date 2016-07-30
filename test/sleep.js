const assert = require('chai').assert

const sleep = require('..').sleep


describe('sleep', function()
{
  it('error when no parameters', function()
  {
    assert.throws(function()
    {
      sleep()
    },
    'Needs an operand')
  })

  it('sleep for 1 second', function()
  {
    const start = new Date()

    sleep(1)

    const diff = new Date() - start

    assert.isAbove(diff, 1000)
    assert.isBelow(diff, 1500)
  })
})
