module.exports = function(path) {
  if (path == 'Gates')
  return require('./Combinational/gates')
  if (path == 'Arithmetics')
  return require('./Combinational/arithmetics')
  if (path == 'Connectors')
  return require('./Connectors/transport')
  if (path == 'Sequential')
  return require('./Sequential/ff')
  if (path == 'IO')
  return require('./Utility/ioManager')
  if (path == 'Base')
  return require('./Utility/new')
}
