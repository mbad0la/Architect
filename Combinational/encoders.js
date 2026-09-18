const { OrGate } = require('./gates')
const { Hardware } = require('../Utility/new')

// 4-to-2 encoder: expects exactly one of i[0..3] high and outputs its index
// in binary (o[0] LSB). Not a priority encoder; with more than one input
// high the outputs are OR-ed together.
class Encoder4x2 extends Hardware {

  constructor(i, o) {
    if (i.length != 4 || o.length != 2) throw new Error('Invalid Connection/s')
    super([i, o])
    this.components.push(new OrGate([i[1]], [i[3]], [o[0]]))
    this.components.push(new OrGate([i[2]], [i[3]], [o[1]]))
  }

}

module.exports = { Encoder4x2 }
