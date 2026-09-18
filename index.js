module.exports = function(path) {
  return {
    'Gates': require('./Combinational/gates'),
    'Arithmetics': require('./Combinational/arithmetics'),
    'Decoders': require('./Combinational/decoders'),
    'Encoders': require('./Combinational/encoders'),
    'Multiplexers': require('./Combinational/multiplexers'),
    'Comparators': require('./Combinational/comparators'),
    'Connectors': require('./Connectors/transport'),
    'Sequential': {
      ...require('./Sequential/ff'),
      ...require('./Sequential/registers'),
      ...require('./Sequential/counters')
    },
    'IO': require('./Utility/ioManager'),
    'Base': require('./Utility/new')
  } [ path ]
}
