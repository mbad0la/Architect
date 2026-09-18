const { DFlipFlop } = require('./ff')
const { DecoderNxM } = require('../Combinational/decoders')
const { Mux2x1, MuxNx1 } = require('../Combinational/multiplexers')
const { wires } = require('../Connectors/transport')
const { Hardware } = require('../Utility/new')

// N-bit parallel-in parallel-out register: q <= d on every rising edge.
// With the optional single-wire en, q <= en ? d : q, so the register holds
// its value on edges where en is low (the clock is never gated).
class Register extends Hardware {

  constructor(d, q, c, en) {
    if (d.length != q.length || (en && en.length != 1)) throw new Error('Invalid Connection/s')
    super(en ? [d, en, q] : [d, q], c)
    const qbar = wires(d.length) // the unused Q' of each flip-flop
    const next = en ? wires(d.length) : d
    this.internalWiring = en ? [...qbar, ...next] : qbar
    if (en) this.components.push(new Mux2x1(q, d, en, next))
    for (let i = 0; i < d.length; i++) {
      this.components.push(new DFlipFlop([next[i]], [q[i], qbar[i]], c))
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

// 2^N registers of W bits with two asynchronous read ports and one
// synchronous write port. qa and qb always show the registers at ra and rb;
// on a rising edge with we high, register wa takes wd.
class RegisterFile extends Hardware {

  constructor(ra, rb, wa, wd, we, qa, qb, c) {
    const size = wa.length
    const width = wd.length
    if (ra.length != size || rb.length != size || qa.length != width || qb.length != width || we.length != 1) {
      throw new Error('Invalid Connection/s')
    }
    super([ra, rb, wa, wd, we, [...qa, ...qb]], c)
    const count = 2 ** size
    const select = wires(count)
    const q = []
    for (let k = 0; k < count; k++) q.push(wires(width))
    this.internalWiring = [...select, ...q.flat()]
    this.registers = q

    this.components.push(new DecoderNxM(wa, select, we))
    for (let k = 0; k < count; k++) {
      this.components.push(new Register(wd, q[k], c, [select[k]]))
    }
    this.components.push(new MuxNx1(q, ra, qa))
    this.components.push(new MuxNx1(q, rb, qb))
  }

}

module.exports = { Register, ShiftRegister, RegisterFile }
