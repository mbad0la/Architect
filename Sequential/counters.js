const { AndGate, XorGate, NotGate } = require('../Combinational/gates')
const { Register } = require('./registers')
const { wires } = require('../Connectors/transport')
const { Hardware } = require('../Utility/new')

// N-bit synchronous up counter with synchronous reset. On each rising edge
// q <= reset ? 0 : q + 1 (wrapping at 2^N). Bit i toggles when every lower
// bit is 1, so the toggle enables form a chain of ANDs.
//
// Flip-flops power up undefined; assert reset for one edge before counting.
class Counter extends Hardware {

  constructor(reset, q, c) {
    if (reset.length != 1 || q.length < 1) throw new Error('Invalid Connection/s')
    super([reset, q], c)
    const size = q.length
    const next = wires(size)      // q + 1
    const d = wires(size)         // next, gated by reset
    const chain = wires(Math.max(size - 2, 0))
    const notReset = wires(1)
    this.internalWiring = [...next, ...d, ...chain, ...notReset]

    // enable[i] = q[0] & ... & q[i]; bit i+1 flips when it is 1
    const enable = [q[0], ...chain]
    this.components.push(new NotGate([q[0]], [next[0]]))
    for (let i = 1; i < size; i++) {
      if (i >= 2) this.components.push(new AndGate([enable[i - 2]], [q[i - 1]], [enable[i - 1]]))
      this.components.push(new XorGate([enable[i - 1]], [q[i]], [next[i]]))
    }

    this.components.push(new NotGate(reset, notReset))
    for (let i = 0; i < size; i++) {
      this.components.push(new AndGate(notReset, [next[i]], [d[i]]))
    }
    this.components.push(new Register(d, q, c))
  }

}

module.exports = { Counter }
