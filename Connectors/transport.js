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

  constructor(t, i) {
    super()

    this.i = i
    this.timePeriod = t
    this.alter = this.alter.bind(this)
    this.switchOn = this.switchOn.bind(this)
    this.switchOff = this.switchOff.bind(this)
    this.interval = undefined
  }

  alter() {
    this.propagateSignal(Number(!this.signal))
  }

  switchOn() {
    if (!this.interval) {
      this.signal = this.i
      this.interval = setInterval(this.alter, this.timePeriod)
    }
  }

  switchOff() {
    if (this.interval) {
      clearInterval(this.interval)
      this.signal = undefined
      this.interval = undefined
    }
  }

}

function wires(n) {
  let wireSet = []
  for(let i = 0; i < n ; i++) {
    wireSet.push(new Wire())
  }
  return wireSet
}

module.exports = { Wire, Pulse, wires }
