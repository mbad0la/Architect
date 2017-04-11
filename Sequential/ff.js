const { AndGate, NorGate, NandGate, NotGate } = require('../Combinational/gates')
const { wires } = require('../Connectors/transport')
const { Hardware } = require('../Utility/new')

class SRFlipFlop extends Hardware {

  constructor(s, r, qqbar, c) {
    if (s.length != 1 || r.length != 1 || qqbar.length != 2) throw new Error('Invalid Connection/s')
    super([s, r, [qqbar[0]]])
    this.internalWiring = wires(2)
    this.components.push(new AndGate([c], s, [this.internalWiring[0]]))
    this.components.push(new AndGate([c], r, [this.internalWiring[1]]))
    this.components.push(new NorGate([this.internalWiring[0]], [qqbar[0]], [qqbar[1]]))
    this.components.push(new NorGate([this.internalWiring[1]], [qqbar[1]], [qqbar[0]]))
  }

}

class DFlipFlop extends Hardware {

  constructor(d, qqbar, c) {
    if (d.length != 1 || qqbar.length != 2) throw new Error('Invalid Connection/s')
    super([d, [qqbar[0]]])
    this.internalWiring = wires(3)
    this.components.push(new NotGate(d, [this.internalWiring[0]]))
    this.components.push(new NandGate([c], d, [this.internalWiring[1]]))
    this.components.push(new NandGate([c], [this.internalWiring[0]], [this.internalWiring[2]]))
    this.components.push(new NorGate([this.internalWiring[1]], [qqbar[1]], [qqbar[0]]))
    this.components.push(new NorGate([this.internalWiring[2]], [qqbar[0]], [qqbar[1]]))
  }

}

class TFlipFlop extends Hardware {

  constructor(t, qqbar, c) {
    if (t.length != 1 || qqbar.length != 2) throw new Error('Invalid Connection/s')
    super([t, [qqbar[0]]])
    this.internalWiring = wires(4)
    this.components.push(new AndGate([c], [qqbar[0]], [this.internalWiring[0]]))
    this.components.push(new AndGate([c], [qqbar[1]], [this.internalWiring[1]]))
    this.components.push(new AndGate(t, [this.internalWiring[0]], [this.internalWiring[2]]))
    this.components.push(new AndGate(t, [this.internalWiring[1]], [this.internalWiring[3]]))
    this.components.push(new NorGate([this.internalWiring[2]], [qqbar[1]], [qqbar[0]]))
    this.components.push(new NorGate([this.internalWiring[3]], [qqbar[0]], [qqbar[1]]))
  }

}

module.exports = { SRFlipFlop, DFlipFlop, TFlipFlop }
