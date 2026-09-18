const { AndGate, NotGate, XnorGate } = require('./gates')
const { PipoSubtractor } = require('./arithmetics')
const { wires } = require('../Connectors/transport')
const { Hardware } = require('../Utility/new')

// N-bit unsigned magnitude comparator. o = [lt, eq, gt]: exactly one is 1.
// Equality is an AND of per-bit XNORs; ordering comes from the borrow of
// a - b (carry out is 1 iff a >= b).
class Comparator extends Hardware {

  constructor(a, b, o) {
    if (a.length != b.length || o.length != 3) throw new Error('Invalid Connection/s')
    super([a, b, o])
    const size = a.length
    const [lt, eq, gt] = o
    const diff = wires(size + 1)
    const notEq = wires(1)
    this.internalWiring = [...diff, ...notEq]

    if (size == 1) {
      this.components.push(new XnorGate([a[0]], [b[0]], [eq]))
    } else {
      // eq = xnor[0] & xnor[1] & ... & xnor[size-1], as a chain of 2-input ANDs
      const xnor = wires(size)
      const chain = wires(size - 2)
      this.internalWiring.push(...xnor, ...chain)
      for (let i = 0; i < size; i++) {
        this.components.push(new XnorGate([a[i]], [b[i]], [xnor[i]]))
      }
      const stages = [xnor[0], ...chain, eq]
      for (let i = 1; i < size; i++) {
        this.components.push(new AndGate([stages[i - 1]], [xnor[i]], [stages[i]]))
      }
    }

    const ge = diff[size]
    this.components.push(new PipoSubtractor(a, b, diff))
    this.components.push(new NotGate([ge], [lt]))
    this.components.push(new NotGate([eq], notEq))
    this.components.push(new AndGate([ge], notEq, [gt]))
  }

}

module.exports = { Comparator }
