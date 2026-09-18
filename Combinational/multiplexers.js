const { AndGate, OrGate, NotGate } = require('./gates')
const { wires } = require('../Connectors/transport')
const { Hardware } = require('../Utility/new')

// 2-to-1 multiplexer over N-bit buses: o = s ? b : a, bit for bit.
class Mux2x1 extends Hardware {

  constructor(a, b, s, o) {
    if (a.length != b.length || o.length != a.length || s.length != 1) throw new Error('Invalid Connection/s')
    super([a, b, s, o])
    let size = a.length
    this.internalWiring = wires(1 + 2 * size)
    const notS = this.internalWiring[0]
    this.components.push(new NotGate(s, [notS]))
    for (let i = 0; i < size; i++) {
      const selA = this.internalWiring[1 + 2 * i]
      const selB = this.internalWiring[2 + 2 * i]
      this.components.push(new AndGate([a[i]], [notS], [selA]))
      this.components.push(new AndGate([b[i]], s, [selB]))
      this.components.push(new OrGate([selA], [selB], [o[i]]))
    }
  }

}

// 4-to-1 multiplexer over N-bit buses, built as a tree of Mux2x1.
// s[0] picks within each pair, s[1] picks the pair: o = inputs[s].
class Mux4x1 extends Hardware {

  constructor(i0, i1, i2, i3, s, o) {
    const size = i0.length
    if ([i1, i2, i3, o].some((bus) => bus.length != size) || s.length != 2) throw new Error('Invalid Connection/s')
    super([i0, i1, i2, i3, s, o])
    this.internalWiring = wires(2 * size)
    const low = this.internalWiring.slice(0, size)
    const high = this.internalWiring.slice(size)
    this.components.push(new Mux2x1(i0, i1, [s[0]], low))
    this.components.push(new Mux2x1(i2, i3, [s[0]], high))
    this.components.push(new Mux2x1(low, high, [s[1]], o))
  }

}

// 2^N-to-1 multiplexer over W-bit buses: o = inputs[s], with s an N-bit
// LSB-first bus. A tree of Mux2x1: s[0] picks within each pair, s[1] picks
// the pair, and so on (Mux4x1 is the N = 2 case).
class MuxNx1 extends Hardware {

  constructor(inputs, s, o) {
    const size = s.length
    const width = o.length
    if (size < 1 || inputs.length != 2 ** size || inputs.some((bus) => bus.length != width)) {
      throw new Error('Invalid Connection/s')
    }
    super([...inputs, s, o])
    const stages = []
    for (let n = inputs.length / 2; n > 1; n /= 2) {
      for (let j = 0; j < n; j++) stages.push(wires(width))
    }
    this.internalWiring = stages.flat()

    let level = inputs
    let offset = 0
    for (let l = 0; l < size; l++) {
      const n = level.length / 2
      const next = l == size - 1 ? [o] : stages.slice(offset, offset + n)
      offset += n
      for (let j = 0; j < n; j++) {
        this.components.push(new Mux2x1(level[2 * j], level[2 * j + 1], [s[l]], next[j]))
      }
      level = next
    }
  }

}

// 1-to-2 demultiplexer over N-bit buses: routes i to o0 when s = 0, to o1
// when s = 1; the unselected output is 0.
class Demux1x2 extends Hardware {

  constructor(i, s, o0, o1) {
    if (o0.length != i.length || o1.length != i.length || s.length != 1) throw new Error('Invalid Connection/s')
    super([i, s, [...o0, ...o1]])
    this.internalWiring = wires(1)
    const notS = this.internalWiring[0]
    this.components.push(new NotGate(s, [notS]))
    for (let k = 0; k < i.length; k++) {
      this.components.push(new AndGate([i[k]], [notS], [o0[k]]))
      this.components.push(new AndGate([i[k]], s, [o1[k]]))
    }
  }

}

module.exports = { Mux2x1, Mux4x1, MuxNx1, Demux1x2 }
