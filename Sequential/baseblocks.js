const { AndGate, NorGate, NandGate } = require('../Combinational/gates')
const { Wire, wires } = require('../Connectors/transport')

class SRFlipFlop {

  constructor(s, r, q, qbar, c) {
    this.internalWiring = wires(2)
    this.components = []
    this.components.push(new AndGate(c, s, this.internalWiring[0]))
    this.components.push(new AndGate(c, r, this.internalWiring[1]))
    this.components.push(new NorGate(this.internalWiring[0], qbar, q))
    this.components.push(new NorGate(this.internalWiring[1], q, qbar))
  }

}

class DFlipFlop {

  constructor(d, q, qbar, c) {
    this.internalWiring = wires(3)
    this.components = []
    this.components.push(new OrGate(d, this.internalWiring[0]))
    this.components.push(new NandGate(c, d, this.internalWiring[1]))
    this.components.push(new NandGate(c, this.internalWiring[0], this.internalWiring[2]))
    this.components.push(new NorGate(this.internalWiring[1], qbar, q))
    this.components.push(new NorGate(this.internalWiring[2], q, qbar))
  }

}

module.exports = { SRFlipFlop, DFlipFlop }
