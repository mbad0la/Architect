var { Wire } = require('../Architect')('Connectors')
var { HalfAdder } = require('../Architect')('Arithmetics')

const a = new Wire()
const b = new Wire()
const s = new Wire()
const c = new Wire()

const adder = new HalfAdder(a,b,s,c)

s.on('signal', function() {
  console.log('s : ' + s.getSignal())
})
c.on('signal', function() {
  console.log('c : ' + c.getSignal())
})

a.propagateSignal(1)
b.propagateSignal(1)
