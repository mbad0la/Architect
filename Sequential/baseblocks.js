const { AndGate, NorGate, NandGate, NotGate } = require('../Combinational/gates')
const { wires } = require('../Connectors/transport')

class SRFlipFlop {

  constructor(sr, qqbar, c) {
    this.internalWiring = wires(2)
    this.components = []
    this.components.push(new AndGate([c, sr[0]], [this.internalWiring[0]]))
    this.components.push(new AndGate([c, sr[1]], [this.internalWiring[1]]))
    this.components.push(new NorGate([this.internalWiring[1], qqbar[1]], [qqbar[0]]))
    this.components.push(new NorGate([this.internalWiring[0], qqbar[0]], [qqbar[1]]))
  }

}

class DFlipFlop {

  constructor(d, qqbar, c) {
    this.internalWiring = wires(3)
    this.components = []
    this.components.push(new NotGate([d[0]], [this.internalWiring[0]]))
    this.components.push(new NandGate([c, d[0]], [this.internalWiring[1]]))
    this.components.push(new NandGate([c, this.internalWiring[0]], [this.internalWiring[2]]))
    this.components.push(new NorGate([this.internalWiring[1], qqbar[1]], [qqbar[0]]))
    this.components.push(new NorGate([this.internalWiring[2], qqbar[0]], [qqbar[1]]))
  }

}

module.exports = { SRFlipFlop, DFlipFlop }
