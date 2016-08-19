const { Hardware } = require('../Utility/new')

class AndGate extends Hardware {

  constructor(x, y, o) {
    if (x.length != 1 || y.length != 1 || o.length != 1) throw new Error('Invalid Connection/s')
    super([x, y, o])
    this.x = x
    this.y = y
    this.o = o
    this.hardware = this.hardware.bind(this)
    x[0].on('signal', this.hardware)
    y[0].on('signal', this.hardware)
  }

  hardware() {
    let xSig = this.x[0].getSignal()
    let ySig = this.y[0].getSignal()
    if (xSig === 0 || ySig === 0) {
      this.o[0].propagateSignal(0)
    } else if (xSig === undefined || ySig === undefined) {
      this.o[0].propagateSignal(undefined)
    } else this.o[0].propagateSignal(xSig && ySig)
  }

}

class TriInpAndGate extends Hardware {

  constructor(x, y, z, o) {
    if (x.length != 1 || y.length != 1 || z.length != 1 || o.length != 1) throw new Error('Invalid Connection/s')
    super([x, y, z, o])
    this.x = x
    this.y = y
    this.z = z
    this.o = o
    this.hardware = this.hardware.bind(this)
    x[0].on('signal', this.hardware)
    y[0].on('signal', this.hardware)
    z[0].on('signal', this.hardware)
  }

  hardware() {
    let xSig = this.x[0].getSignal()
    let ySig = this.y[0].getSignal()
    let zSig = this.z[0].getSignal()
    if (xSig === 0 || ySig === 0 || zSig === 0) {
      this.o[0].propagateSignal(0)
    } else if (xSig === undefined || ySig === undefined || zSig === undefined) {
      this.o[0].propagateSignal(undefined)
    } else this.o[0].propagateSignal(xSig && ySig && zSig)
  }

}

class OrGate extends Hardware {

  constructor(x, y, o) {
    if (x.length != 1 || y.length != 1 || o.length != 1) throw new Error('Invalid Connection/s')
    super([x, y, o])
    this.x = x
    this.y = y
    this.o  = o
    this.hardware = this.hardware.bind(this)
    x[0].on('signal', this.hardware)
    y[0].on('signal', this.hardware)
  }

  hardware() {
    let xSig = this.x[0].getSignal()
    let ySig = this.y[0].getSignal()
    if (xSig === 1 || ySig === 1) {
      this.o[0].propagateSignal(1)
    } else if (xSig === undefined || ySig === undefined) {
      this.o[0].propagateSignal(undefined)
    } else this.o[0].propagateSignal(xSig || ySig)
  }

}

class XorGate extends Hardware {

  constructor(x, y, o) {
    if (x.length != 1 || y.length != 1 || o.length != 1) throw new Error('Invalid Connection/s')
    super([x, y, o])
    this.x = x
    this.y = y
    this.o  = o
    this.hardware = this.hardware.bind(this)
    x[0].on('signal', this.hardware)
    y[0].on('signal', this.hardware)
  }

  hardware() {
    let xSig = this.x[0].getSignal()
    let ySig = this.y[0].getSignal()
    if (xSig === undefined || ySig === undefined) {
      this.o[0].propagateSignal(undefined)
    } else this.o[0].propagateSignal(Number(xSig != ySig))
  }

}

class NotGate extends Hardware {

  constructor(x, o) {
    if (x.length != 1 || o.length != 1) throw new Error('Invalid Connection/s')
    super([x, o])
    this.x = x
    this.o = o
    this.hardware = this.hardware.bind(this)
    x[0].on('signal', this.hardware)
  }

  hardware() {
    let xSig = this.x[0].getSignal()
    if (xSig === undefined) {
      this.o[0].propagateSignal(undefined)
    } else this.o[0].propagateSignal(Number(!xSig))
  }

}

class NandGate extends Hardware {

  constructor(x, y, o) {
    if (x.length != 1 || y.length != 1 || o.length != 1) throw new Error('Invalid Connection/s')
    super([x, y, o])
    this.x = x
    this.y = y
    this.o  = o
    this.hardware = this.hardware.bind(this)
    x[0].on('signal', this.hardware)
    y[0].on('signal', this.hardware)
  }

  hardware() {
    let xSig = this.x[0].getSignal()
    let ySig = this.y[0].getSignal()
    if (xSig === 0 || ySig === 0) {
      this.o[0].propagateSignal(1)
    } else if (xSig === undefined || ySig === undefined) {
      this.o[0].propagateSignal(undefined)
    } else this.o[0].propagateSignal(Number(!(xSig && ySig)))
  }

}

class NorGate extends Hardware {

  constructor(x, y, o) {
    if (x.length != 1 || y.length != 1 || o.length != 1) throw new Error('Invalid Connection/s')
    super([x, y, o])
    this.x = x
    this.y = y
    this.o  = o
    this.hardware = this.hardware.bind(this)
    x[0].on('signal', this.hardware)
    y[0].on('signal', this.hardware)
  }

  hardware() {
    let xSig = this.x[0].getSignal()
    let ySig = this.y[0].getSignal()
    if (xSig === 1 || ySig === 1) {
      this.o[0].propagateSignal(0)
    } else if (xSig === undefined || ySig === undefined) {
      this.o[0].propagateSignal(undefined)
    } else this.o[0].propagateSignal(Number(!(xSig || ySig)))
  }

}

class XnorGate extends Hardware {

  constructor(x, y, o) {
    if (x.length != 1 || y.length != 1 || o.length != 1) throw new Error('Invalid Connection/s')
    super([x, y, o])
    this.x = x
    this.y = y
    this.o  = o
    this.hardware = this.hardware.bind(this)
    x[0].on('signal', this.hardware)
    y[0].on('signal', this.hardware)
  }

  hardware() {
    let xSig = this.x[0].getSignal()
    let ySig = this.y[0].getSignal()
    if (xSig === undefined || ySig === undefined) {
      this.o[0].propagateSignal(undefined)
    } else this.o[0].propagateSignal(Number(xSig == ySig))
  }

}

module.exports = { AndGate, TriInpAndGate, OrGate, XorGate, NotGate, NandGate, NorGate, XnorGate }
