let { PipoAdder } = require('../Architect')('Arithmetics')
let { Wire, wires } = require('../Architect')('Connectors')
let { SRFlipFlop } = require('../Architect')('Base')
const a = new Wire()
const b = new Wire()
const q = new Wire()
const qbar = new Wire()
const f = new Wire(1)

const ff = new SRFlipFlop(a,b,q,qbar,f)

q.on('signal', function() {
  console.log(' Q : ' + q.getSignal())
})
qbar.on('signal', function() {
  console.log( ' Qbar : ' + qbar.getSignal())
})


console.log('INPUT : 1 & 0')

a.propagateSignal(1)
b.propagateSignal(0)


console.log('INPUT 0 & 1')

a.propagateSignal(0)
b.propagateSignal(1)
