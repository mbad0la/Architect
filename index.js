var EventEmitter = require('events')

class Wire extends EventEmitter {

  constructor() {
    super()

    this.signal = undefined
    this.propagateSignal = this.propagateSignal.bind(this)
    this.getSignal = this.getSignal.bind(this)
  }

  propagateSignal(newSignal) {
    let oldSignal = this.signal

    this.signal = newSignal

    if (oldSignal != this.signal) this.emit('change')
  }

  getSignal() {
    return this.signal
  }

}


class AndGate {

  constructor(x, y, z) {
    this.x = x
    this.y = y
    this.z  = z
    this.react = this.react.bind(this)
    x.on('change', this.react)
    y.on('change', this.react)
  }

  react() {
    let xSig = this.x.getSignal()
    let ySig = this.y.getSignal()
    if (xSig === undefined || ySig === undefined) {
      this.z.propagateSignal(undefined)
    } else this.z.propagateSignal(xSig && ySig)
  }

}

class OrGate {

  constructor(x, y, z) {
    this.x = x
    this.y = y
    this.z  = z
    this.react = this.react.bind(this)
    x.on('change', this.react)
    y.on('change', this.react)
  }

  react() {
    let xSig = this.x.getSignal()
    let ySig = this.y.getSignal()
    if (xSig === undefined || ySig === undefined) {
      this.z.propagateSignal(undefined)
    } else this.z.propagateSignal(xSig || ySig)
  }

}

class NotGate {

  constructor(x, y) {
    this.x = x
    this.y = y
    this.react = this.react.bind(this)
    x.on('change', this.react)
  }

  react() {
    let xSig = this.x.getSignal()
    if (xSig === undefined) {
      this.y.propagateSignal(undefined)
    } else this.y.propagateSignal(Number(!xSig))
  }

}

class XorGate {

  constructor(x, y, z) {
    this.x = x
    this.y = y
    this.z  = z
    this.react = this.react.bind(this)
    x.on('change', this.react)
    y.on('change', this.react)
  }

  react() {
    let xSig = this.x.getSignal()
    let ySig = this.y.getSignal()
    if (xSig === undefined || ySig === undefined) {
      this.z.propagateSignal(undefined)
    } else this.z.propagateSignal(Number(xSig != ySig))
  }

}

class HalfAdder {

  constructor(x, y, s, c) {
    const sum = new XorGate(x, y, s)
    const carry = new AndGate(x, y, c)
  }

}

class ManageIO {

  constructor(args, format) {
    this.in = args.in
    this.out = args.out
    this.format = format
    this.results = this.results.bind(this)
  }

  results(inputArray) {
    let out = {}
    this.in.forEach((wire, i) => {
      wire.propagateSignal(inputArray[i])
    })
    this.out.forEach((wire, i) => {
      out[this.format[i]] = wire.getSignal()
    })
    console.log(out)
  }

}


const xWire = new Wire()
const yWire = new Wire()
const zWire = new Wire()
const kWire = new Wire()
let ioManagerOne = new ManageIO({in: [xWire, yWire], out: [zWire, kWire]}, ['sum', 'carry'])

const myAdder = new HalfAdder(xWire, yWire, zWire, kWire)

// xWire.propagateSignal(1)
// yWire.propagateSignal(1)
// console.log('X : ' + xWire.getSignal() + ' Y : ' + yWire.getSignal() + ' S : ' + zWire.getSignal() + ' C : ' + kWire.getSignal())
// yWire.propagateSignal(1)
// console.log('X : ' + xWire.getSignal() + ' Y : ' + yWire.getSignal() + ' S : ' + zWire.getSignal() + ' C : ' + kWire.getSignal())
// yWire.propagateSignal(undefined)
// console.log('X : ' + xWire.getSignal() + ' Y : ' + yWire.getSignal() + ' S : ' + zWire.getSignal() + ' C : ' + kWire.getSignal())
// yWire.propagateSignal(0)
// console.log('X : ' + xWire.getSignal() + ' Y : ' + yWire.getSignal() + ' S : ' + zWire.getSignal() + ' C : ' + kWire.getSignal())
ioManagerOne.results([1,1])
ioManagerOne.results([1,undefined])
ioManagerOne.results([1,0])
