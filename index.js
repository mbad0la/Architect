var EventEmitter = require('events')

class Link extends EventEmitter {

  constructor() {
    super()

    this.signal = undefined
    this.propagateSignal = this.propagateSignal.bind(this)
    this.getSignal = this.getSignal.bind(this)
  }

  propagateSignal(newSignal) {
    let oldSignal = this.signal

    if (newSignal === undefined) {
      this.signal = undefined
    } else { this.signal = this.signal || newSignal }

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
    this.z.propagateSignal(xSig && ySig)
  }

}

const xLink = new Link()
const yLink = new Link()
const zLink = new Link()

const myAnd = new AndGate(xLink, yLink, zLink)

zLink.on('change', () => {
  console.log('Z output is : ' + zLink.getSignal())
})

xLink.propagateSignal(1)
yLink.propagateSignal(1)
yLink.propagateSignal(1)
yLink.propagateSignal(undefined)
yLink.propagateSignal(0)
