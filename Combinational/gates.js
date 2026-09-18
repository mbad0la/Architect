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
    this.hardware() // evaluate now: inputs may already carry a signal
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
    this.hardware() // evaluate now: inputs may already carry a signal
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
    this.hardware() // evaluate now: inputs may already carry a signal
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
    this.hardware() // evaluate now: inputs may already carry a signal
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
    this.hardware() // evaluate now: inputs may already carry a signal
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
    this.hardware() // evaluate now: inputs may already carry a signal
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
    this.hardware() // evaluate now: inputs may already carry a signal
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
    this.hardware() // evaluate now: inputs may already carry a signal
  }

  hardware() {
    let xSig = this.x[0].getSignal()
    let ySig = this.y[0].getSignal()
    if (xSig === undefined || ySig === undefined) {
      this.o[0].propagateSignal(undefined)
    } else this.o[0].propagateSignal(Number(xSig == ySig))
  }

}

// Bitwise gates over N-bit buses: one 1-bit gate per bit position.

function bitwise(Gate) {
  return class extends Hardware {
    constructor(a, b, o) {
      if (a.length != b.length || o.length != a.length) throw new Error('Invalid Connection/s')
      super([a, b, o])
      for (let i = 0; i < a.length; i++) {
        this.components.push(new Gate([a[i]], [b[i]], [o[i]]))
      }
    }
  }
}

class BitwiseAnd extends bitwise(AndGate) {}
class BitwiseOr extends bitwise(OrGate) {}
class BitwiseXor extends bitwise(XorGate) {}

class BitwiseNot extends Hardware {

  constructor(a, o) {
    if (o.length != a.length) throw new Error('Invalid Connection/s')
    super([a, o])
    for (let i = 0; i < a.length; i++) {
      this.components.push(new NotGate([a[i]], [o[i]]))
    }
  }

}

module.exports = {
  AndGate, TriInpAndGate, OrGate, XorGate, NotGate, NandGate, NorGate, XnorGate,
  BitwiseAnd, BitwiseOr, BitwiseXor, BitwiseNot
}
