const { OrGate, Buffer } = require('../Combinational/gates')
const { DecoderNxM } = require('../Combinational/decoders')
const { MuxNx1 } = require('../Combinational/multiplexers')
const { Register } = require('./registers')
const { wires } = require('../Connectors/transport')
const { Hardware } = require('../Utility/new')

// 2^N words of W bits. addr is an N-bit LSB-first bus, din and dout are W
// bits wide. Reads are asynchronous: dout always shows the word at addr.
// Writes are synchronous: on a rising edge with we high, din is stored at
// addr; every other word holds.
//
// Each word is a Register whose load-enable comes from a DecoderNxM that
// is itself enabled by we; dout comes off a MuxNx1 indexed by addr.
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
    const q = []
    for (let w = 0; w < words; w++) q.push(wires(width))
    this.internalWiring = [...select, ...q.flat()]
    this.words = q

    this.components.push(new DecoderNxM(addr, select, we))
    for (let w = 0; w < words; w++) {
      this.components.push(new Register(din, q[w], c, [select[w]]))
    }
    this.components.push(new MuxNx1(q, addr, dout))
  }

}

// Read-only memory of 2^N words, W bits wide, programmed at construction.
// contents is an array of up to 2^N words, each a binary string written MSB
// first (like StringIO) or a number; missing words read as 0. A DecoderNxM
// selects the word line and each output bit ORs the lines whose word has
// that bit set, so o always shows contents[addr].
class ROM extends Hardware {

  constructor(addr, o, contents) {
    const size = addr.length
    const width = o.length
    if (size < 1 || width < 1 || contents.length > 2 ** size) throw new Error('Invalid Connection/s')
    super([addr, o])
    const words = 2 ** size
    const lines = wires(words)
    this.internalWiring = [...lines]
    this.components.push(new DecoderNxM(addr, lines))

    const bits = contents.map((word) => {
      const n = typeof word == 'string' ? parseInt(word, 2) : word
      if (!Number.isInteger(n) || n < 0 || n >= 2 ** width) throw new Error(`Invalid ROM word ${word}`)
      return n
    })
    for (let j = 0; j < width; j++) {
      const set = lines.filter((line, k) => (bits[k] >> j) & 1)
      if (set.length == 0) {
        o[j].propagateSignal(0)
        continue
      }
      if (set.length == 1) {
        this.components.push(new Buffer([set[0]], [o[j]]))
        continue
      }
      // OR chain: set[0] | set[1] | ... | set[last] -> o[j]
      let acc = set[0]
      for (let k = 1; k < set.length; k++) {
        const out = k == set.length - 1 ? o[j] : wires(1)[0]
        if (out !== o[j]) this.internalWiring.push(out)
        this.components.push(new OrGate([acc], [set[k]], [out]))
        acc = out
      }
    }
  }

}

module.exports = { RAM, ROM }
