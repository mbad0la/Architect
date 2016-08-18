class StringIO {

  constructor(...ioMappings) {
    let inputGroup = ioMappings.length - 1
    this.i = ioMappings.slice(0, inputGroup)
    this.o = ioMappings[inputGroup]
  }

  resultOf(...inputSeqs) {
    let inpIndex = inputSeqs[0].length - 1
    let totalInps = this.i.length
    let pos = 0
    while (inpIndex >= 0) {
      for (let inpNum = 0; inpNum < totalInps; ++inpNum) {
        this.i[inpNum][pos].propagateSignal(Number(inputSeqs[inpNum][inpIndex]))
      }
      ++pos
      --inpIndex
    }

    let outBuff = this.o.map((wire) => {
      return wire.getSignal()
    })

    outBuff = outBuff.reverse().join('')
    console.log(outBuff)
  }

}

module.exports = { StringIO }
