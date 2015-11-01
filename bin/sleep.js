#!/usr/bin/env node


const REG_EXP = /[^\d\.]+/


function noop(){}

function reduce(previousValue, currentValue)
{
  var number = parseFloat(currentValue)
  var suffix = currentValue.match(REG_EXP)

  if(suffix) suffix = suffix[0]
  switch(suffix)
  {
    case 'd': number *= 24
    case 'h': number *= 60
    case 'm': number *= 60

    case 's': case null:
      number *= 1000
    break

    default:
      throw 'Unknown suffix "'+suffix+'"'
  }

  return previousValue + number
}


setTimeout(noop, process.argv.slice(2).reduce(reduce, 0))
