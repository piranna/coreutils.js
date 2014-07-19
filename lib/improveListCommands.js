var grep = require('./grep')
var sort = require('./sort')


function inspectList(depth)
{
  return this.map(function(item)
  {
    if(item.inspect)
      return item.inspect(depth)
    return item
  }).join('\n')
}


function improveListCommands(list)
{
  Object.defineProperty(list, 'inspect', {value: inspectList});

  Object.defineProperty(list, 'grep', {value: grep});
  Object.defineProperty(list, 'sort', {value: sort});
}


module.exports = improveListCommands
