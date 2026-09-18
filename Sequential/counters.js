const { AndGate, OrGate, NotGate } = require('../Combinational/gates')
const { Incrementer } = require('../Combinational/arithmetics')
const { Mux2x1 } = require('../Combinational/multiplexers')
const { Register } = require('./registers')
const { wires } = require('../Connectors/transport')
const { Hardware } = require('../Utility/new')

// N-bit synchronous up counter with synchronous reset. On each rising edge
// q <= reset ? 0 : q + 1 (wrapping at 2^N).
//
// Flip-flops power up undefined; assert reset for one edge before counting.
class Counter extends Hardware {

  constructor(reset, q, c) {
    if (reset.length != 1 || q.length < 1) throw new Error('Invalid Connection/s')
    super([reset, q], c)
    const size = q.length
    const next = wires(size)      // q + 1
    const d = wires(size)         // next, gated by reset
    const notReset = wires(1)
    this.internalWiring = [...next, ...d, ...notReset]

    this.components.push(new Incrementer(q, next))
    this.components.push(new NotGate(reset, notReset))
    for (let i = 0; i < size; i++) {
      this.components.push(new AndGate(notReset, [next[i]], [d[i]]))
    }
    this.components.push(new Register(d, q, c))
  }

}

// N-bit program counter. On each rising edge, in priority order:
//   reset  q <= 0
//   load   q <= d          (jump)
//   en     q <= q + 1      (fetch next)
//   else   q <= q          (halt)
class ProgramCounter extends Hardware {

  constructor(d, load, en, reset, q, c) {
    const size = q.length
    if (d.length != size || load.length != 1 || en.length != 1 || reset.length != 1) {
      throw new Error('Invalid Connection/s')
    }
    super([d, load, en, reset, q], c)
    const next = wires(size)      // q + 1
    const target = wires(size)    // load ? d : next
    const value = wires(size)     // target, gated by reset
    const notReset = wires(1)
    const advance = wires(1)      // en | load
    const write = wires(1)        // advance | reset
    this.internalWiring = [...next, ...target, ...value, ...notReset, ...advance, ...write]

    this.components.push(new Incrementer(q, next))
    this.components.push(new Mux2x1(next, d, load, target))
    this.components.push(new NotGate(reset, notReset))
    for (let i = 0; i < size; i++) {
      this.components.push(new AndGate(notReset, [target[i]], [value[i]]))
    }
    this.components.push(new OrGate(en, load, advance))
    this.components.push(new OrGate(advance, reset, write))
    this.components.push(new Register(value, q, c, write))
  }

}

module.exports = { Counter, ProgramCounter }
