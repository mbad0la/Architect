const { DecoderNxM } = require('../Combinational/decoders')
const { Mux2x1 } = require('../Combinational/multiplexers')
const { Register } = require('./registers')
const { wires } = require('../Connectors/transport')
const { Hardware } = require('../Utility/new')

// 2^N words of W bits. addr is an N-bit LSB-first bus, din and dout are W
// bits wide. Reads are asynchronous: dout always shows the word at addr.
// Writes are synchronous: on a rising edge with we high, din is stored at
// addr; every other word holds.
//
// Each word is a Register whose input is a Mux2x1 choosing between its own
// output (hold) and din (load), steered by a DecoderNxM that is enabled by
// we. dout comes off a tree of Mux2x1 indexed by addr, like Mux4x1.
//
// Words power up undefined; a word reads as undefined until first written.
class RAM extends Hardware {

  constructor(addr, din, we, dout, c) {
    const size = addr.length
    const width = din.length
    if (size < 1 || width < 1 || dout.length != width || we.length != 1) throw new Error('Invalid Connection/s')
    super([addr, din, we, dout], c)
    const words = 2 ** size
    const select = wires(words)
    const d = []          // per-word register input
    const q = []          // per-word register output
    for (let w = 0; w < words; w++) {
      d.push(wires(width))
      q.push(wires(width))
    }
    const readTree = []   // intermediate buses of the read mux tree
    for (let n = words / 2; n > 1; n /= 2) {
      for (let j = 0; j < n; j++) readTree.push(wires(width))
    }
    this.internalWiring = [...select, ...d.flat(), ...q.flat(), ...readTree.flat()]

    this.components.push(new DecoderNxM(addr, select, we))
    for (let w = 0; w < words; w++) {
      this.components.push(new Mux2x1(q[w], din, [select[w]], d[w]))
      this.components.push(new Register(d[w], q[w], c))
    }

    // read: addr[0] picks within each pair, addr[1] picks the pair, ...
    let level = q
    let offset = 0
    for (let l = 0; l < size; l++) {
      const n = level.length / 2
      const next = l == size - 1 ? [dout] : readTree.slice(offset, offset + n)
      offset += n
      for (let j = 0; j < n; j++) {
        this.components.push(new Mux2x1(level[2 * j], level[2 * j + 1], [addr[l]], next[j]))
      }
      level = next
    }
  }

}

module.exports = { RAM }
