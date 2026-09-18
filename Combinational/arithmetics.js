const { AndGate, XorGate, OrGate, NotGate } = require('./gates')
const { wires } = require('../Connectors/transport')
const { Hardware } = require('../Utility/new')

// Bus convention: index 0 is the least significant bit on every bus.
// Sum buses are one bit wider than their operands; the extra top bit is
// the carry out.

class HalfAdder extends Hardware {

  constructor(x, s) {
    if (x.length != 2 || s.length != 2) throw new Error('Invalid Connection/s')
    super([x, s])
    this.components.push(new XorGate([x[0]], [x[1]], [s[0]]))
    this.components.push(new AndGate([x[0]], [x[1]], [s[1]]))
  }

}

class FullAdder extends Hardware {

  constructor(x, s) {
    if (x.length != 3 || s.length != 2) throw new Error('Invalid Connection/s')
    super([x, s])
    this.internalWiring = wires(3)
    this.components.push(new HalfAdder([x[0], x[1]], [this.internalWiring[0], this.internalWiring[1]]))
    this.components.push(new HalfAdder([this.internalWiring[0], x[2]], [s[0], this.internalWiring[2]]))
    this.components.push(new OrGate([this.internalWiring[1]], [this.internalWiring[2]], [s[1]]))
  }

}

// Ripple-carry adder. cin is an optional single-wire carry in; when omitted
// it is tied to 0.
class PipoAdder extends Hardware {

  constructor(a, b, s, cin) {
    if (a.length != b.length || s.length != a.length + 1) throw new Error('Invalid Connection/s')
    if (cin !== undefined && cin.length != 1) throw new Error('Invalid Connection/s')
    super([a, b, s])
    let size = a.length
    this.internalWiring = wires(size)
    const carry = [cin ? cin[0] : this.internalWiring[0], ...this.internalWiring.slice(1), s[size]]
    for (let i = 0; i < size; i++) {
      this.components.push(new FullAdder([a[i], b[i], carry[i]], [s[i], carry[i + 1]]))
    }
    if (!cin) this.internalWiring[0].propagateSignal(0)
  }

}

// Two's complement subtractor: a - b = a + ~b + 1. The top bit of d is the
// adder's carry out, which is 1 when a >= b (no borrow) and 0 when a < b.
// The lower bits are the difference modulo 2^n.
class PipoSubtractor extends Hardware {

  constructor(a, b, d) {
    if (a.length != b.length || d.length != a.length + 1) throw new Error('Invalid Connection/s')
    super([a, b, d])
    let size = a.length
    this.internalWiring = wires(size + 1)
    const notB = this.internalWiring.slice(0, size)
    const one = this.internalWiring[size]
    for (let i = 0; i < size; i++) {
      this.components.push(new NotGate([b[i]], [notB[i]]))
    }
    this.components.push(new PipoAdder(a, notB, d, [one]))
    one.propagateSignal(1)
  }

}

// o = a + 1 modulo 2^N. Bit i toggles when every lower bit is 1, so the
// carries form a chain of ANDs: far cheaper than an adder with b = 1.
class Incrementer extends Hardware {

  constructor(a, o) {
    if (a.length < 1 || o.length != a.length) throw new Error('Invalid Connection/s')
    super([a, o])
    const size = a.length
    const chain = wires(Math.max(size - 2, 0))
    this.internalWiring = chain

    // carry[i] = a[0] & ... & a[i]; bit i+1 flips when it is 1
    const carry = [a[0], ...chain]
    this.components.push(new NotGate([a[0]], [o[0]]))
    for (let i = 1; i < size; i++) {
      if (i >= 2) this.components.push(new AndGate([carry[i - 2]], [a[i - 1]], [carry[i - 1]]))
      this.components.push(new XorGate([carry[i - 1]], [a[i]], [o[i]]))
    }
  }

}

module.exports = { HalfAdder, FullAdder, PipoAdder, PipoSubtractor, Incrementer }
