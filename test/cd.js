const homedir     = require('os').homedir
const strictEqual = require('assert').strictEqual

const cd = require('..').cd


describe('cd', function()
{
  it('move to $HOME', function()
  {
    const oldpwd = process.cwd()

    cd()

    strictEqual(process.cwd(), homedir())
    strictEqual(process.env.OLDPWD, oldpwd)
  })
})
