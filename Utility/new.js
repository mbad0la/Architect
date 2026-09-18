class Hardware {

  // io: data ports, every element an array of Wire, last one the output.
  // clock: optional Wire (usually a Clock) for sequential hardware; kept
  // apart from io so StringIO only drives data and tick() drives the clock.
  constructor(io, clock) {
    this.ioMapping = io
    this.clock = clock
    this.internalWiring = []
    this.components = []
  }

}

module.exports = { Hardware }
