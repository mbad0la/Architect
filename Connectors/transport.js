const EventEmitter = require('events')

// Delta-cycle scheduler. Wires never emit directly; they enqueue writes here,
// and run() applies them in rounds so evaluation order never depends on the
// order in which components registered their listeners.
class Simulator {

  constructor(maxDelta = 1000) {
    this.pending = new Map()
    this.maxDelta = maxDelta
    this.running = false
  }

  schedule(wire, value) {
    this.pending.set(wire, value)
  }

  run() {
    if (this.running) return
    this.running = true
    try {
      for (let delta = 0; this.pending.size; delta++) {
        if (delta >= this.maxDelta) {
          const unstable = [...this.pending.keys()].map((w) => w.name || 'anonymous wire')
          this.pending.clear()
          throw new Error(`Circuit did not settle after ${this.maxDelta} delta cycles (still changing: ${unstable.join(', ')})`)
        }
        const batch = this.pending
        this.pending = new Map()
        const changed = []
        for (const [wire, value] of batch) {
          if (wire.signal != value) {
            wire.signal = value
            changed.push(wire)
          }
        }
        for (const wire of changed) wire.emit('signal')
      }
    } finally {
      this.running = false
    }
  }

}

const simulator = new Simulator()

class Wire extends EventEmitter {

  constructor(sig, name) {
    super()

    this.signal = sig
    this.name = name
    this.propagateSignal = this.propagateSignal.bind(this)
    this.getSignal = this.getSignal.bind(this)
  }

  propagateSignal(newSignal) {
    simulator.schedule(this, newSignal)
  }

  getSignal() {
    return this.signal
  }

}

// Simulated clock: each tick() flips the signal and settles the circuit
// synchronously, so tests can drive edges deterministically.
class Clock extends Wire {

  constructor(initial = 0, name = 'clock') {
    super(initial, name)
    this.tick = this.tick.bind(this)
  }

  tick() {
    this.propagateSignal(Number(!this.signal))
    simulator.run()
  }

}

// Real-time clock driven by setInterval. Prefer Clock for simulation.
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
    simulator.run()
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

function wires(n, name) {
  let wireSet = []
  for(let i = 0; i < n ; i++) {
    wireSet.push(new Wire(undefined, name && `${name}[${i}]`))
  }
  return wireSet
}

module.exports = { Simulator, simulator, Wire, Clock, Pulse, wires }
