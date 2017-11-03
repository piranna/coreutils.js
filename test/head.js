const assert = require('assert')
const fs     = require('fs')

const concat = require('concat-stream')
const str    = require('string-to-stream')

const head          = require('..').head
const InspectStream = require('../lib/common').InspectStream


describe('head', function()
{
  it('stdin', function(done)
  {
    const input = '12345678900987654321'.split('')
    const expected = input.slice(0, 10).join('\n')+'\n'

    const stdin = str(input.join('\n'))

    stdin.pipe(head())
    .on('error', done)
    .pipe(concat(function(data)
    {
      assert.strictEqual(data, expected)

      done()
    }))
  })

  it('file', function(done)
  {
    const input = '12345678900987654321'.split('')
    const expected = input.slice(0, 10).join('\n')+'\n'

    fs.mkdtemp('/tmp/', function(err, folder)
    {
      assert.ifError(err)

      const path = folder+'head.txt'

      fs.writeFile(path, expected, function(err)
      {
        assert.ifError(err)

        head(path)
        .on('error', done)
        .pipe(concat(function(data)
        {
          assert.strictEqual(data, expected)

          done()
        }))
      })
    })
  })

  it('multiple files', function(done)
  {
    const expected = '12345678900987654321'.split('')

    fs.mkdtemp('/tmp/', function(err, folder)
    {
      assert.ifError(err)

      const path1 = folder+'head1.txt'

      fs.writeFile(path1, expected.slice(0, 10).join('\n')+'\n', function(err)
      {
        assert.ifError(err)

        const path2 = folder+'head2.txt'

        fs.writeFile(path2, expected.slice(10).join('\n')+'\n', function(err)
        {
          assert.ifError(err)

          head(path1, path2)
          .on('error', done)
          .pipe(head.verbose())
          .pipe(concat(function(data)
          {
            assert.strictEqual(data, expected)

            done()
          }))
        })
      })
    })
  })

  it('multiple files - verbose', function(done)
  {
    const input  = '12345678900987654321'.split('')
    const input1 = input.slice(0, 10).join('\n')+'\n'
    const input2 = input.slice(10).join('\n')+'\n'

    fs.mkdtemp('/tmp/', function(err, folder)
    {
      assert.ifError(err)

      const path1 = folder+'head1.txt'

      fs.writeFile(path1, input1, function(err)
      {
        assert.ifError(err)

        const path2 = folder+'head2.txt'

        fs.writeFile(path2, input2, function(err)
        {
          assert.ifError(err)

          head(path1, path2, '-v')
          .on('error', done)
          .pipe(head.verbose())
          .pipe(concat(function(data)
          {
            const expected = `==> {path1} <==`+'\n'+input1+'\n\n'
                            +`==> {path2} <==`+'\n'+input2

            assert.strictEqual(data, expected)

            done()
          }))
        })
      })
    })
  })

  it('allButLastLines', function(done)
  {
    const input = '12345678900987654321'.split('')
    const expected = input.slice(0, 15).join('\n')+'\n'

    const stdin = str(input.join('\n'))

    stdin.pipe(head(['-n=-5']))
    .on('error', done)
    .pipe(concat(function(data)
    {
      assert.strictEqual(data, expected)

      done()
    }))
  })

  it('zero terminated', function(done)
  {
    const input = '12345678900987654321'.split('')
    const expected = input.slice(0, 10).join('\0')+'\0'

    const stdin = str(input.join('\0'))

    stdin.pipe(head('-z'))
    .on('error', done)
    .pipe(concat(function(data)
    {
      assert.strictEqual(data, expected)

      done()
    }))
  })

  it('bytes', function(done)
  {
    const input = '12345678900987654321'.split('')
    const expected = input.slice(0, 10).join()

    const stdin = str(input.join())

    stdin.pipe(head('-c=10'))
    .on('error', done)
    .pipe(concat(function(data)
    {
      assert.strictEqual(data, expected)

      done()
    }))
  })

  it('allButLastBytes', function(done)
  {
    const input = '12345678900987654321'.split('')
    const expected = input.slice(0, 15).join()

    const stdin = str(input.join())

    stdin.pipe(head(['-c=-5']))
    .on('error', done)
    .pipe(concat(function(data)
    {
      assert.strictEqual(data, expected)

      done()
    }))
  })
})


//stdin from file
//stdin from multiple file
// -n 3




/*
piranna@msi:~/github/coreutils.js$ head package.json package.json -q -c 1
{{piranna@msi:~/github/coreutils.js$ head package.json package.json -n 1
==> package.json <==
{

==> package.json <==
{
piranna@msi:~/github/coreutils.js$ head package.json package.json -q -n 1
{
{
piranna@msi:~/github/coreutils.js$
*/
