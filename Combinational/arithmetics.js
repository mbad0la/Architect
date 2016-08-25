const { AndGate, XorGate, OrGate } = require('./gates')
const { wires } = require('../Connectors/transport')
const { Hardware } = require('../Utility/new')

class HalfAdder extends Hardware {

  constructor(x, s) {
    if (x.length != 2 || s.length != 2) throw new Error('Invalid Connection/s')
    super([x, s])
    this.components.push(new XorGate([x[0]], [x[1]], [s[1]]))
    this.components.push(new AndGate([x[0]], [x[1]], [s[0]]))
  }

}

class FullAdder extends Hardware {

  constructor(x, s) {
    if (x.length != 3 || s.length != 2) throw new Error('Invalid Connection/s')
    super([x, s])
    this.internalWiring = wires(3)
    this.components.push(new HalfAdder([x[0], x[1]], [this.internalWiring[0], this.internalWiring[1]]))
    this.components.push(new HalfAdder([this.internalWiring[1], x[2]], [this.internalWiring[2], s[1]]))
    this.components.push(new OrGate([this.internalWiring[0]], [this.internalWiring[2]], [s[0]]))
  }

}

class PipoAdder extends Hardware {

  constructor(a, b, s) {
    if (a.length != b.length || s.length != a.length + 1) throw new Error('Invalid Connection/s')
    super([a, b, s])
    let size = a.length
    this.internalWiring = wires(size)
    if (size > 1) {
      this.components.push(new FullAdder([a[0], b[0], this.internalWiring[0]], [this.internalWiring[1], s[size]]))
      for(let i = 1; i < size - 1; i++) {
        this.components.push(new FullAdder([a[i], b[i], this.internalWiring[i]], [this.internalWiring[i+1], s[size-i]]))
      }
      this.components.push(new FullAdder([a[size-1], b[size-1], this.internalWiring[size-1]], [s[0], s[1]]))
    } else {
      this.components.push(new FullAdder([a[0], b[0], this.internalWiring[0]], [s[0], s[1]]))
    }
    this.internalWiring[0].propagateSignal(0)
  }

}

module.exports = { HalfAdder, FullAdder, PipoAdder }
