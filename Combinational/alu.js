const { AndGate, OrGate, NotGate, BitwiseAnd, BitwiseOr } = require('./gates')
const { PipoAdder, PipoSubtractor } = require('./arithmetics')
const { Mux2x1, Mux4x1 } = require('./multiplexers')
const { wires } = require('../Connectors/transport')
const { Hardware } = require('../Utility/new')

// N-bit arithmetic logic unit. All four operations are computed in parallel
// and op selects which one reaches the result bus:
//
//   op = 00  ADD   result = a + b        carry = carry out
//   op = 01  SUB   result = a - b        carry = 1 iff a >= b (no borrow)
//   op = 10  AND   result = a & b        carry = 0
//   op = 11  OR    result = a | b        carry = 0
//
// flags = [carry, zero]. zero is 1 when every result bit is 0, so after a
// SUB, zero means a == b and carry means a >= b: enough for every branch
// condition on unsigned operands.
class ALU extends Hardware {

  static ADD = '00'
  static SUB = '01'
  static AND = '10'
  static OR = '11'

  constructor(a, b, op, result, flags) {
    const size = a.length
    if (b.length != size || result.length != size || op.length != 2 || flags.length != 2) {
      throw new Error('Invalid Connection/s')
    }
    super([a, b, op, [...result, ...flags]])
    const sum = wires(size + 1)
    const diff = wires(size + 1)
    const and = wires(size)
    const or = wires(size)
    const arithCarry = wires(1)
    const isArith = wires(1)
    const anyBit = wires(size - 1)
    this.internalWiring = [...sum, ...diff, ...and, ...or, ...arithCarry, ...isArith, ...anyBit]
    const [carry, zero] = flags

    this.components.push(new PipoAdder(a, b, sum))
    this.components.push(new PipoSubtractor(a, b, diff))
    this.components.push(new BitwiseAnd(a, b, and))
    this.components.push(new BitwiseOr(a, b, or))
    this.components.push(new Mux4x1(sum.slice(0, size), diff.slice(0, size), and, or, op, result))

    // carry: the selected arithmetic op's carry out, forced to 0 for logic ops
    this.components.push(new Mux2x1([sum[size]], [diff[size]], [op[0]], arithCarry))
    this.components.push(new NotGate([op[1]], isArith))
    this.components.push(new AndGate(isArith, arithCarry, [carry]))

    // zero: NOT (result[0] | result[1] | ... )
    if (size == 1) {
      this.components.push(new NotGate([result[0]], [zero]))
    } else {
      const stages = [result[0], ...anyBit]
      for (let i = 1; i < size; i++) {
        this.components.push(new OrGate([stages[i - 1]], [result[i]], [stages[i]]))
      }
      this.components.push(new NotGate([anyBit[size - 2]], [zero]))
    }
  }

}

module.exports = { ALU }
