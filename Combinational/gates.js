class AndGate {

  constructor(x, y, z) {
    this.x = x
    this.y = y
    this.z  = z
    this.hardware = this.hardware.bind(this)
    x.on('signal', this.hardware)
    y.on('signal', this.hardware)
  }

  hardware() {
    let xSig = this.x.getSignal()
    let ySig = this.y.getSignal()
    if (xSig === 0 || ySig === 0) {
      this.z.propagateSignal(0)
    } else if (xSig === undefined || ySig === undefined) {
      this.z.propagateSignal(undefined)
    } else this.z.propagateSignal(xSig && ySig)
  }

}

class OrGate {

  constructor(x, y, z) {
    this.x = x
    this.y = y
    this.z  = z
    this.hardware = this.hardware.bind(this)
    x.on('signal', this.hardware)
    y.on('signal', this.hardware)
  }

  hardware() {
    let xSig = this.x.getSignal()
    let ySig = this.y.getSignal()
    if (xSig === 1 || ySig === 1) {
      this.z.propagateSignal(1)
    } else if (xSig === undefined || ySig === undefined) {
      this.z.propagateSignal(undefined)
    } else this.z.propagateSignal(xSig || ySig)
  }

}

class XorGate {

  constructor(x, y, z) {
    this.x = x
    this.y = y
    this.z  = z
    this.hardware = this.hardware.bind(this)
    x.on('signal', this.hardware)
    y.on('signal', this.hardware)
  }

  hardware() {
    let xSig = this.x.getSignal()
    let ySig = this.y.getSignal()
    if (xSig === undefined || ySig === undefined) {
      this.z.propagateSignal(undefined)
    } else this.z.propagateSignal(Number(xSig != ySig))
  }

}

class NotGate {

  constructor(x, y) {
    this.x = x
    this.y = y
    this.hardware = this.hardware.bind(this)
    x.on('signal', this.hardware)
  }

  hardware() {
    let xSig = this.x.getSignal()
    if (xSig === undefined) {
      this.y.propagateSignal(undefined)
    } else this.y.propagateSignal(Number(!xSig))
  }

}

class NandGate {

  constructor(x, y, z) {
    this.x = x
    this.y = y
    this.z  = z
    this.hardware = this.hardware.bind(this)
    x.on('signal', this.hardware)
    y.on('signal', this.hardware)
  }

  hardware() {
    let xSig = this.x.getSignal()
    let ySig = this.y.getSignal()
    if (xSig === 0 || ySig === 0) {
      this.z.propagateSignal(1)
    } else if (xSig === undefined || ySig === undefined) {
      this.z.propagateSignal(undefined)
    } else this.z.propagateSignal(Number(!(xSig && ySig)))
  }

}

class NorGate {

  constructor(x, y, z) {
    this.x = x
    this.y = y
    this.z  = z
    this.hardware = this.hardware.bind(this)
    x.on('signal', this.hardware)
    y.on('signal', this.hardware)
  }

  hardware() {
    let xSig = this.x.getSignal()
    let ySig = this.y.getSignal()
    if (xSig === 1 || ySig === 1) {
      this.z.propagateSignal(0)
    } else if (xSig === undefined || ySig === undefined) {
      this.z.propagateSignal(undefined)
    } else this.z.propagateSignal(Number(!(xSig || ySig)))
  }

}

class XnorGate {

  constructor(x, y, z) {
    this.x = x
    this.y = y
    this.z  = z
    this.hardware = this.hardware.bind(this)
    x.on('signal', this.hardware)
    y.on('signal', this.hardware)
  }

  hardware() {
    let xSig = this.x.getSignal()
    let ySig = this.y.getSignal()
    if (xSig === undefined || ySig === undefined) {
      this.z.propagateSignal(undefined)
    } else this.z.propagateSignal(Number(xSig == ySig))
  }

}

module.exports = { AndGate, OrGate, XorGate, NotGate, NandGate, NorGate, XnorGate }
