const { AndGate, XorGate, OrGate } = require('./gates')
const { Wire, wireSet } = require('../Connectors/transport')

class HalfAdder {

  constructor(x, y, s, c) {
    this.components = []
    this.components.push(new XorGate(x, y, s))
    this.components.push(new AndGate(x, y, c))
  }

}

class FullAdder {

  constructor(x, y, z, s, c) {
    this.internalWiring = wireSet(3)
    this.components = []
    this.components.push(new HalfAdder(x, y, internalWiring[0], internalWiring[1]))
    this.components.push(new HalfAdder(internalWiring[0], z, s, internalWiring[2]))
    this.components.push(new OrGate(internalWiring[1], internalWiring[2], c))
  }

}

class PipoAdder {

  constructor(a, b, s, c) {
    let size = a.length
    this.internalWiring = wireSet(size)
    this.components = []
    if (size > 1) {
      this.components.push(new FullAdder(a[0], b[0], this.internalWiring[0], s[0], this.internalWiring[1]))
      for(let i = 1; i < size - 1; i++) {
        this.components.push(new FullAdder(a[i], b[i], this.internalWiring[i], s[i], this.internalWiring[i+1]))
      }
      this.components.push(new FullAdder(a[size-1], b[size-1], this.internalWiring[size-1], s[size-1], c))
    } else {
      this.components.push(new FullAdder(a[0], b[0], this.internalWiring[0], s[0], c))
    }
    this.internalWiring[0].propagateSignal(0)
  }

}

module.exports = { HalfAdder, FullAdder, PipoAdder }
