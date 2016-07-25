const EventEmitter = require('events')

class Wire extends EventEmitter {

  constructor(sig) {
    super()

    this.signal = sig
    this.propagateSignal = this.propagateSignal.bind(this)
    this.getSignal = this.getSignal.bind(this)
  }

  propagateSignal(newSignal) {
    let oldSignal = this.signal

    this.signal = newSignal

    if (oldSignal != this.signal) this.emit('signal')
  }

  getSignal() {
    return this.signal
  }

}

class Pulse extends Wire {

  constructor(t, s, i) {
    super(i)

    this.timePeriod = t
    this.state = s
    this.alter = this.alter.bind(this)
    this.switchOn = this.switchOn.bind(this)
    this.switchOff = this.switchOff.bind(this)
    setInterval(this.alter, t)
  }

  alter() {
    if (this.state) {
      this.propagateSignal(Number(!this.getSignal()))
    }
  }

  switchOn() {
    this.state = true
  }

  switchOff() {
    this.state = false
  }

}

function wireSet(n) {
  let wires = []
  for(let i = 0; i < n ; i++) {
    wires.push(new Wire())
  }
  return wires
}

module.exports = { Wire, Pulse, wireSet }
