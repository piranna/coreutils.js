const assert = require('assert')
const fs     = require('fs')

const concat = require('concat-stream')
const str    = require('string-to-stream')

const cat = require('..').cat


describe('cat', function()
{
  xit('stdin', function(done)
  {
    const expected = 'asdf'

    const stdin = str(expected)

    cat.call(stdin)
    .on('error', done)
    .pipe(concat(function(data)
    {
      assert.strictEqual(data, expected)

      done()
    }))
  })

  it('file', function(done)
  {
    const expected = 'asdf'

    fs.mkdtemp('/tmp/', function(err, folder)
    {
      assert.ifError(err)

      const path = folder+'cat.txt'

      fs.writeFile(path, expected, function(err)
      {
        assert.ifError(err)

        cat(path)
        .on('error', done)
        .on('data', function(data)
        {
          assert.strictEqual(data.toString(), expected)

          done()
        })
      })
    })
  })
})
