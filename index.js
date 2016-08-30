module.exports = function(path) {
  return {
    'Gates': require('./Combinational/gates'),
    'Arithmetics': require('./Combinational/arithmetics'),
    'Connectors': require('./Connectors/transport'),
    'Sequential': require('./Sequential/ff'),
    'IO': require('./Utility/ioManager'),
    'Base': require('./Utility/new')
  } [ path ]
}
