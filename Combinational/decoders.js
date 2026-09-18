const { Hardware } = require('../Utility/new')
const { wires, Wire } = require('../Connectors/transport')
const { NotGate, AndGate } = require('./gates')

class Decoder1x2 extends Hardware {

  constructor(x, o) {
    if (x.length != 1 || o.length != 1) throw new Error('Invalid Connection/s')
    super([x, [x[0], o[0]]])
    this.components.push(new NotGate(x, o))
  }

}

class Decoder2x4 extends Hardware {

  constructor(x0, x1, o) {
    if(x0.length != 1 || x1.length != 1 || o.length != 4) throw new Error('Invalid Connection/s')
    super([x0, x1, o])
    this.internalWiring = wires(2)
    this.components.push(new Decoder1x2(x0, [this.internalWiring[0]]))
    this.components.push(new Decoder1x2(x1, [this.internalWiring[1]]))
    this.components.push(new AndGate([this.internalWiring[0]], [this.internalWiring[1]], [o[0]]))
    this.components.push(new AndGate([this.internalWiring[0]], x1, [o[1]]))
    this.components.push(new AndGate(x0, [this.internalWiring[1]], [o[2]]))
    this.components.push(new AndGate(x0, x1, [o[3]]))
  }

}

// N-to-2^N decoder over an LSB-first address bus: o[k] is 1 iff x reads k
// in binary. Built as a tree: the root line splits on x[0], each of those on
// x[1], and so on, so line j at level l forks into j (x[l] = 0) and j + 2^l
// (x[l] = 1). The root is the optional enable wire; when en is 0 every
// output is 0. Without en the root is tied high.
class DecoderNxM extends Hardware {

  constructor(x, o, en) {
    const size = x.length
    if (size < 1 || o.length != 2 ** size || (en && en.length != 1)) throw new Error('Invalid Connection/s')
    super(en ? [x, en, o] : [x, o])
    const notX = wires(size)
    const inner = wires(2 ** size - 2) // lines of levels 1 .. size - 1
    const root = en ? en[0] : new Wire(1, 'vcc')
    this.internalWiring = [...notX, ...inner, ...(en ? [] : [root])]

    let level = [root]
    for (let l = 0; l < size; l++) {
      this.components.push(new NotGate([x[l]], [notX[l]]))
      const width = level.length
      const next = l == size - 1 ? o : inner.slice(2 * width - 2, 4 * width - 2)
      for (let j = 0; j < width; j++) {
        this.components.push(new AndGate([level[j]], [notX[l]], [next[j]]))
        this.components.push(new AndGate([level[j]], [x[l]], [next[j + width]]))
      }
      level = next
    }
  }

}

module.exports = { Decoder1x2, Decoder2x4, DecoderNxM }
