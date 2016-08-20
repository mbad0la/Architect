const { Hardware } = require('../Utility/new')
const { wires } = require('../Connectors/transport')
const { NotGate, AndGate } = require('./gates')

class Decoder1x2 extends Hardware {

  constructor(x, o) {
    if (x.length != 1 || o.length != 1) throw new Error('Invalid Connection/s')
    super([x, [o[0], x[0]]])
    this.components.push(new NotGate(x, o))
  }

}

class Decoder2x4 extends Hardware {

  constructor(x0, x1, o) {
    if(x0.length != 1 || x1.length != 1 || o.length != 4) throw new Error('Invalid Connection/s')
    super([x0, x1, o])
    this.internalWiring = wires(2)
    this.components.push(new Decoder1x2(x0, [this.internalWiring[0]]))
    this.components.push(new Decoder1x2(x1, [this.internalWiring[1]]))
    this.components.push(new AndGate([this.internalWiring[0]], [this.internalWiring[1]], [o[0]]))
    this.components.push(new AndGate([this.internalWiring[0]], x1, [o[1]]))
    this.components.push(new AndGate(x0, [this.internalWiring[1]], [o[2]]))
    this.components.push(new AndGate(x0, x1, [o[3]]))
  }

}

module.exports = { Decoder1x2, Decoder2x4 }
