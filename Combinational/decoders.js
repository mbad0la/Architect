const { Hardware } = require('../Utility/new')
let { NotGate } = require('./gates')

class LineDecoder extends Hardware {

  constructor(x, o) {
    if (x.length != 1 || o.length != 1) throw new Error('Invalid Connection/s')
    super([x, [x[0], o[0]]])
    this.components.push(new NotGate(x, o))
  }

}

module.exports = { LineDecoder }
