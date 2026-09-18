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

  // Number of primitive gates in this hardware. A component with no
  // sub-components is a primitive (its logic lives in its hardware method).
  gateCount() {
    if (this.components.length == 0) return 1
    return this.components.reduce((n, c) => n + c.gateCount(), 0)
  }

}

module.exports = { Hardware }
