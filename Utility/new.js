class Hardware {

  constructor(io) {
    this.ioMapping = io
    this.internalWiring = []
    this.components = []
  }

}

module.exports = { Hardware }
