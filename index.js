module.exports = function(path) {
  return {
    'Gates': require('./Combinational/gates'),
    'Arithmetics': require('./Combinational/arithmetics'),
    'Decoders': require('./Combinational/decoders'),
    'Encoders': require('./Combinational/encoders'),
    'Multiplexers': require('./Combinational/multiplexers'),
    'Comparators': require('./Combinational/comparators'),
    'ALU': require('./Combinational/alu'),
    'Connectors': require('./Connectors/transport'),
    'Sequential': {
      ...require('./Sequential/ff'),
      ...require('./Sequential/registers'),
      ...require('./Sequential/counters'),
      ...require('./Sequential/memory'),
      ...require('./Sequential/cpu')
    },
    'CPU': require('./Sequential/cpu'),
    'IO': require('./Utility/ioManager'),
    'Base': require('./Utility/new')
  } [ path ]
}
