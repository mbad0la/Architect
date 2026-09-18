const { DFlipFlop } = require('./ff')
const { wires } = require('../Connectors/transport')
const { Hardware } = require('../Utility/new')

// N-bit parallel-in parallel-out register: q <= d on every rising edge.
class Register extends Hardware {

  constructor(d, q, c) {
    if (d.length != q.length) throw new Error('Invalid Connection/s')
    super([d, q], c)
    this.internalWiring = wires(d.length) // the unused Q' of each flip-flop
    for (let i = 0; i < d.length; i++) {
      this.components.push(new DFlipFlop([d[i]], [q[i], this.internalWiring[i]], c))
    }
  }

}

// N-bit serial-in parallel-out shift register. On every rising edge the
// serial input enters at q[0] and every bit moves up one position, so the
// contents shift left as a binary number and q[q.length - 1] falls off.
class ShiftRegister extends Hardware {

  constructor(sin, q, c) {
    if (sin.length != 1 || q.length < 1) throw new Error('Invalid Connection/s')
    super([sin, q], c)
    this.internalWiring = wires(q.length)
    for (let i = 0; i < q.length; i++) {
      const d = i == 0 ? sin[0] : q[i - 1]
      this.components.push(new DFlipFlop([d], [q[i], this.internalWiring[i]], c))
    }
  }

}

module.exports = { Register, ShiftRegister }
