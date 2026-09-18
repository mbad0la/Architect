const { simulator } = require('../Connectors/transport')

// Bus convention: wire[0] is the LSB. Strings are written MSB first like a
// binary literal, so '0110' on a 4-wire bus drives wire[1] and wire[2].
class StringIO {

  constructor({ioMapping}) {
    let inputGroup = ioMapping.length - 1
    this.i = ioMapping.slice(0, inputGroup)
    this.o = ioMapping[inputGroup]
  }

  input(...inputSeqs) {
    if (inputSeqs.length != this.i.length) {
      throw new Error(`Expected ${this.i.length} input string/s, got ${inputSeqs.length}`)
    }
    this.i.forEach((bus, inpNum) => {
      const seq = inputSeqs[inpNum]
      if (seq.length != bus.length) {
        throw new Error(`Input ${inpNum} is ${bus.length} wire/s wide, got '${seq}'`)
      }
      bus.forEach((wire, pos) => wire.propagateSignal(Number(seq[seq.length - 1 - pos])))
    })

    // settle the circuit before reading outputs
    simulator.run()

    return this.o.map((wire) => wire.getSignal()).reverse().join('')
  }

}

module.exports = { StringIO }
