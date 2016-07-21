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

    if (oldSignal != this.signal) this.emit('signal')
  }

  getSignal(character = false) {
    if (character) {
      return String(this.signal)
    } else {
      return this.signal
    }
  }

}

function wireSet(n) {
  let wires = []
  for(let i = 0; i < n ; i++) {
    wires.push(new Wire())
  }
  return wires
}


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
    this.hardware = this.hardware.bind(this)
    x.on('signal', this.hardware)
    y.on('signal', this.hardware)
  }

  hardware() {
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

class HalfAdder {

  constructor(x, y, s, c) {
    const sum = new XorGate(x, y, s)
    const carry = new AndGate(x, y, c)
  }

}

class FullAdder {

  constructor(x, y, z, s, c) {
    const partialSum = new Wire()
    const partialCarryOne = new Wire()
    const partialCarryTwo = new Wire()
    const halfAdderOne = new HalfAdder(x, y, partialSum, partialCarryOne)
    const halfAdderTwo = new HalfAdder(partialSum, z, s, partialCarryTwo)
    const carryOr = new OrGate(partialCarryOne, partialCarryTwo, c)
  }

}

class PipoAdder {

  constructor(a, b, s, c) {
    let size = a.length
    this.carries = wireSet(size)
    this.components = []
    if (size > 1) {
      this.components.push(new FullAdder(a[0], b[0], this.carries[0], s[0], this.carries[1]))
      for(let i = 1; i < size - 1; i++) {
        this.components.push(new FullAdder(a[i], b[i], this.carries[i], s[i], this.carries[i+1]))
      }
      this.components.push(new FullAdder(a[size-1], b[size-1], this.carries[size-1], s[size-1], c))
    } else {
      this.components.push(new FullAdder(a[0], b[0], this.carries[0], s[0], c))
    }
    this.carries[0].propagateSignal(0)
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

const a = wireSet(4)
const b = wireSet(4)
const s = wireSet(4)
const c = new Wire()

const fourBitAdder = new PipoAdder(a, b, s, c)


for(let j = 0; j < 4; j++) {
  a[j].propagateSignal(Math.floor(Math.random() * 2))
  b[j].propagateSignal(Math.floor(Math.random() * 2))
}
console.log(a[3].getSignal(true) + a[2].getSignal(true) + a[1].getSignal(true) + a[0].getSignal(true) + ' + ' + b[3].getSignal(true) + b[2].getSignal(true) + b[1].getSignal(true) + b[0].getSignal(true) + ' ->')
console.log('Sum : ' + s[3].getSignal(true) + s[2].getSignal(true) + s[1].getSignal(true) + s[0].getSignal(true))
console.log('Carry : ' + c.getSignal(true))
