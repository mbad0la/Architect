const { AndGate, NorGate, NandGate, NotGate } = require('../Combinational/gates')
const { wires } = require('../Connectors/transport')
const { Hardware } = require('../Utility/new')

// Level-sensitive latches: transparent while the clock is high, holding while
// it is low. Building blocks for the edge-triggered flip-flops below.

class SRLatch extends Hardware {

  constructor(s, r, qqbar, c) {
    if (s.length != 1 || r.length != 1 || qqbar.length != 2) throw new Error('Invalid Connection/s')
    super([s, r, [qqbar[0]]], c)
    this.internalWiring = wires(2)
    this.components.push(new AndGate([c], s, [this.internalWiring[0]]))
    this.components.push(new AndGate([c], r, [this.internalWiring[1]]))
    this.components.push(new NorGate([this.internalWiring[0]], [qqbar[0]], [qqbar[1]]))
    this.components.push(new NorGate([this.internalWiring[1]], [qqbar[1]], [qqbar[0]]))
  }

}

class DLatch extends Hardware {

  constructor(d, qqbar, c) {
    if (d.length != 1 || qqbar.length != 2) throw new Error('Invalid Connection/s')
    super([d, [qqbar[0]]], c)
    this.internalWiring = wires(3)
    this.components.push(new NotGate(d, [this.internalWiring[0]]))
    this.components.push(new NandGate([c], d, [this.internalWiring[1]]))
    this.components.push(new NandGate([c], [this.internalWiring[0]], [this.internalWiring[2]]))
    this.components.push(new NandGate([this.internalWiring[1]], [qqbar[1]], [qqbar[0]]))
    this.components.push(new NandGate([this.internalWiring[2]], [qqbar[0]], [qqbar[1]]))
  }

}

// Inverts the clock for a master latch. The NotGate only fires when the clock
// changes, so seed its output from the clock's current level; otherwise the
// master would sit undefined until the first edge.
function invertedClock(c, out) {
  const inverter = new NotGate([c], out)
  const level = c.getSignal()
  if (level !== undefined) out[0].propagateSignal(Number(!level))
  return inverter
}

// Master-slave, rising-edge triggered. The master is open while the clock is
// low and the slave while it is high, so they are never open together and the
// input can only reach Q at the 0 -> 1 transition.

class SRFlipFlop extends Hardware {

  constructor(s, r, qqbar, c) {
    if (s.length != 1 || r.length != 1 || qqbar.length != 2) throw new Error('Invalid Connection/s')
    super([s, r, [qqbar[0]]], c)
    this.internalWiring = wires(3)
    const [notC, m, mbar] = this.internalWiring
    this.components.push(invertedClock(c, [notC]))
    this.components.push(new SRLatch(s, r, [m, mbar], notC))
    this.components.push(new SRLatch([m], [mbar], qqbar, c))
  }

}

class DFlipFlop extends Hardware {

  constructor(d, qqbar, c) {
    if (d.length != 1 || qqbar.length != 2) throw new Error('Invalid Connection/s')
    super([d, [qqbar[0]]], c)
    this.internalWiring = wires(3)
    const [notC, m, mbar] = this.internalWiring
    this.components.push(invertedClock(c, [notC]))
    this.components.push(new DLatch(d, [m, mbar], notC))
    this.components.push(new DLatch([m], qqbar, c))
  }

}

module.exports = { SRLatch, DLatch, SRFlipFlop, DFlipFlop }
