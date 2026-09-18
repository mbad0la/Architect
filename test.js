const test = require('ava').default
const { wires, Pulse, Clock, simulator } = require('./Connectors/transport')
const { NotGate, AndGate, TriInpAndGate, XorGate } = require('./Combinational/gates')
const { PipoAdder, HalfAdder, FullAdder } = require('./Combinational/arithmetics')
const { SRLatch, DLatch, SRFlipFlop, DFlipFlop } = require('./Sequential/ff')
const { StringIO } = require('./Utility/ioManager')
const { Decoder1x2, Decoder2x4 } = require('./Combinational/decoders')


test('Not-Gate : 1', t => {
  const inputA = wires(1)
  const output = wires(1)
  const hWare = new NotGate(inputA, output)
  const ioHandler = new StringIO(hWare)
  t.is(ioHandler.input('1'), '0')
})

test('Not-Gate : 2', t => {
  const inputA = wires(1)
  const output = wires(1)
  const hWare = new NotGate(inputA, output)
  const ioHandler = new StringIO(hWare)
  t.is(ioHandler.input('0'), '1')
})

test('And-Gate : 1', t => {
  const inputA = wires(1)
  const inputB = wires(1)
  const output = wires(1)
  const hWare = new AndGate(inputA, inputB, output)
  const ioHandler = new StringIO(hWare)
  t.is(ioHandler.input('0', '0'), '0')
})

test('And-Gate : 2', t => {
  const inputA = wires(1)
  const inputB = wires(1)
  const output = wires(1)
  const hWare = new AndGate(inputA, inputB, output)
  const ioHandler = new StringIO(hWare)
  t.is(ioHandler.input('0', '1'), '0')
})

test('And-Gate : 3', t => {
  const inputA = wires(1)
  const inputB = wires(1)
  const output = wires(1)
  const hWare = new AndGate(inputA, inputB, output)
  const ioHandler = new StringIO(hWare)
  t.is(ioHandler.input('1', '1'), '1')
})

test('Tri-Input And-Gate', t => {
  const inputX = wires(1)
  const inputY = wires(1)
  const inputZ = wires(1)
  const output = wires(1)
  const hWare = new TriInpAndGate(inputX, inputY, inputZ, output)
  const ioHandler = new StringIO(hWare)
  t.is(ioHandler.input('1', '1', '1'), '1')
})

test('Xor-Gate : 1', t => {
  const inputA = wires(1)
  const inputB = wires(1)
  const output = wires(1)
  const hWare = new XorGate(inputA, inputB, output)
  const ioHandler = new StringIO(hWare)
  t.is(ioHandler.input('1', '1'), '0')
})

test('Xor-Gate : 2', t => {
  const inputA = wires(1)
  const inputB = wires(1)
  const output = wires(1)
  const hWare = new XorGate(inputA, inputB, output)
  const ioHandler = new StringIO(hWare)
  t.is(ioHandler.input('0', '1'), '1')
})

test('Overflow for HalfAdder', t => {
  const inputA = wires(2)
  const sum = wires(2)
  const hWare = new HalfAdder(inputA, sum)
  const ioHandler = new StringIO(hWare)
  t.is(ioHandler.input('11'), '10')
})

test('Overflow for FullAdder', t => {
  const inputA = wires(3)
  const sum = wires(2)
  const hWare = new FullAdder(inputA, sum)
  const ioHandler = new StringIO(hWare)
  t.is(ioHandler.input('111'), '11')
})

test('Overflow for Parallel Adder (1 bit)', t => {
  const inputA = wires(1)
  const inputB = wires(1)
  const sum = wires(2)
  const hWare = new PipoAdder(inputA, inputB, sum)
  const ioHandler = new StringIO(hWare)
  t.is(ioHandler.input('1', '1'), '10')
})

test('Overflow for Parallel Adder (2 bit)', t => {
  const inputA = wires(2)
  const inputB = wires(2)
  const sum = wires(3)
  const hWare = new PipoAdder(inputA, inputB, sum)
  const ioHandler = new StringIO(hWare)
  t.is(ioHandler.input('11', '11'), '110')
})

test('Overflow for Parallel Adder (4 bit)', t => {
  const inputA = wires(4)
  const inputB = wires(4)
  const sum = wires(5)
  const hWare = new PipoAdder(inputA, inputB, sum)
  const ioHandler = new StringIO(hWare)
  t.is(ioHandler.input('1111', '1111'), '11110')
})

test('HalfAdder - 1 bit PIPO Equivalence : 1', t => {
  const inputA = wires(1)
  const inputB = wires(1)
  const sum1 = wires(2)
  const halfAdderInput = wires(2)
  const sum2 = wires(2)
  const hWare1 = new PipoAdder(inputA, inputB, sum1)
  const hWare2 = new HalfAdder(halfAdderInput, sum2)
  const ioHandler1 = new StringIO(hWare1)
  const ioHandler2 = new StringIO(hWare2)
  t.is(ioHandler1.input('1', '1'), ioHandler2.input('11'))
})

test('HalfAdder - 1 bit PIPO Equivalence : 2', t => {
  const inputA = wires(1)
  const inputB = wires(1)
  const sum1 = wires(2)
  const halfAdderInput = wires(2)
  const sum2 = wires(2)
  const hWare1 = new PipoAdder(inputA, inputB, sum1)
  const hWare2 = new HalfAdder(halfAdderInput, sum2)
  const ioHandler1 = new StringIO(hWare1)
  const ioHandler2 = new StringIO(hWare2)
  t.is(ioHandler1.input('1', '0'), ioHandler2.input('10'))
})

test('HalfAdder - 1 bit PIPO Equivalence : 3', t => {
  const inputA = wires(1)
  const inputB = wires(1)
  const sum1 = wires(2)
  const halfAdderInput = wires(2)
  const sum2 = wires(2)
  const hWare1 = new PipoAdder(inputA, inputB, sum1)
  const hWare2 = new HalfAdder(halfAdderInput, sum2)
  const ioHandler1 = new StringIO(hWare1)
  const ioHandler2 = new StringIO(hWare2)
  t.is(ioHandler1.input('0', '0'), ioHandler2.input('00'))
})

// Helper: write values to single-bit input wires and settle the circuit.
const drive = (...pairs) => {
  for (const [wire, value] of pairs) wire[0].propagateSignal(value)
  simulator.run()
}

test('SR-Latch : transparent while clock is high', t => {
  const s = wires(1), r = wires(1), qqbar = wires(2)
  const clock = new Clock(1)
  new SRLatch(s, r, qqbar, clock)
  drive([s, 1], [r, 0])
  t.is(qqbar[0].getSignal(), 1)
  drive([s, 0], [r, 1])
  t.is(qqbar[0].getSignal(), 0)
  drive([s, 0], [r, 0])
  t.is(qqbar[0].getSignal(), 0, 'holds when S=R=0')
})

test('D-Latch : transparent while clock is high, holds while low', t => {
  const d = wires(1), qqbar = wires(2)
  const clock = new Clock(1)
  new DLatch(d, qqbar, clock)
  drive([d, 1])
  t.is(qqbar[0].getSignal(), 1)
  drive([d, 0])
  t.is(qqbar[0].getSignal(), 0)
  clock.tick() // clock -> 0
  drive([d, 1])
  t.is(qqbar[0].getSignal(), 0, 'ignored while clock is low')
})

test('SR-Flip-Flop : Set / Reset on rising edge', t => {
  const s = wires(1), r = wires(1), qqbar = wires(2)
  const clock = new Clock(0)
  new SRFlipFlop(s, r, qqbar, clock)
  drive([s, 1], [r, 0])
  clock.tick() // rising edge
  t.is(qqbar[0].getSignal(), 1)
  t.is(qqbar[1].getSignal(), 0)
  clock.tick() // falling edge
  drive([s, 0], [r, 1])
  clock.tick() // rising edge
  t.is(qqbar[0].getSignal(), 0)
  t.is(qqbar[1].getSignal(), 1)
})

test('SR-Flip-Flop : No Change when S=R=0', t => {
  const s = wires(1), r = wires(1), qqbar = wires(2)
  const clock = new Clock(0)
  new SRFlipFlop(s, r, qqbar, clock)
  drive([s, 1], [r, 0])
  clock.tick(); clock.tick()
  drive([s, 0], [r, 0])
  clock.tick(); clock.tick()
  t.is(qqbar[0].getSignal(), 1)
})

test('D-Flip-Flop : samples D only on the rising edge', t => {
  const d = wires(1), qqbar = wires(2)
  const clock = new Clock(0)
  new DFlipFlop(d, qqbar, clock)
  drive([d, 0])
  clock.tick() // rising edge, D=0
  t.is(qqbar[0].getSignal(), 0)
  drive([d, 1])
  t.is(qqbar[0].getSignal(), 0, 'clock high: not transparent')
  clock.tick() // falling edge
  t.is(qqbar[0].getSignal(), 0, 'falling edge: no change')
  drive([d, 0]); drive([d, 1])
  t.is(qqbar[0].getSignal(), 0, 'clock low: no change')
  clock.tick() // rising edge, D=1
  t.is(qqbar[0].getSignal(), 1)
  t.is(qqbar[1].getSignal(), 0)
})

test('D-Flip-Flop : works with StringIO for the data input', t => {
  const d = wires(1), qqbar = wires(2)
  const clock = new Clock(0)
  const ioHandler = new StringIO(new DFlipFlop(d, qqbar, clock))
  t.is(ioHandler.input('1'), '', 'no edge yet: output undefined')
  clock.tick()
  t.is(ioHandler.input('1'), '1')
  t.is(ioHandler.input('0'), '1', 'clock high: held')
})

test('D-Flip-Flop : shift register advances one stage per edge (no race-through)', t => {
  const inp = wires(1), q1 = wires(2), q2 = wires(2), q3 = wires(2)
  const clock = new Clock(0)
  new DFlipFlop(inp, q1, clock)
  new DFlipFlop([q1[0]], q2, clock)
  new DFlipFlop([q2[0]], q3, clock)
  const state = () => [q1[0], q2[0], q3[0]].map((w) => w.getSignal()).join('')
  drive([inp, 0])
  clock.tick(); clock.tick()
  clock.tick(); clock.tick()
  clock.tick(); clock.tick()
  t.is(state(), '000')
  drive([inp, 1])
  clock.tick(); clock.tick()
  t.is(state(), '100')
  drive([inp, 0])
  clock.tick(); clock.tick()
  t.is(state(), '010')
  clock.tick(); clock.tick()
  t.is(state(), '001')
  clock.tick(); clock.tick()
  t.is(state(), '000')
})

test('1x2 Decoder : 1', t => {
  const inputA = wires(1)
  const outputA = wires(1)
  const linerDecoder = new Decoder1x2(inputA, outputA)
  const ioHandler = new StringIO(linerDecoder)
  t.is(ioHandler.input('0'), '10')
})

test('1x2 Decoder : 2', t => {
  const inputA = wires(1)
  const outputA = wires(1)
  const linerDecoder = new Decoder1x2(inputA, outputA)
  const ioHandler = new StringIO(linerDecoder)
  t.is(ioHandler.input('1'), '01')
})

test('2x4 Decoder : 1', t => {
  const inputX = wires(1)
  const inputY = wires(1)
  const output = wires(4)
  const d2x4 = new Decoder2x4(inputX, inputY, output)
  const ioHandler = new StringIO(d2x4)
  t.is(ioHandler.input('0', '0'), '1000')
})

test('2x4 Decoder : 2', t => {
  const inputX = wires(1)
  const inputY = wires(1)
  const output = wires(4)
  const d2x4 = new Decoder2x4(inputX, inputY, output)
  const ioHandler = new StringIO(d2x4)
  t.is(ioHandler.input('1' ,'0'), '0010')
})

test('2x4 Decoder : 3', t => {
  const inputX = wires(1)
  const inputY = wires(1)
  const output = wires(4)
  const d2x4 = new Decoder2x4(inputX, inputY, output)
  const ioHandler = new StringIO(d2x4)
  t.is(ioHandler.input('1', '1'), '0001')
})

test('Simulator : propagation is independent of listener registration order', t => {
  // master-slave D flip-flop built two ways; must give the same answer
  const build = (inverterFirst) => {
    const d = wires(1), clk = new Clock(0), nclk = wires(1), m = wires(2), q = wires(2)
    if (inverterFirst) { new NotGate([clk], nclk); new DLatch(d, m, clk) }
    else { new DLatch(d, m, clk); new NotGate([clk], nclk) }
    new DLatch([m[0]], q, nclk[0])
    d[0].propagateSignal(0); clk.tick(); clk.tick()
    d[0].propagateSignal(1); simulator.run()
    clk.tick()
    const afterRise = q[0].getSignal()
    clk.tick()
    const afterFall = q[0].getSignal()
    return [afterRise, afterFall]
  }
  t.deepEqual(build(true), [0, 1])
  t.deepEqual(build(false), [0, 1])
})

test('Simulator : unstable feedback throws instead of overflowing the stack', t => {
  const w = wires(1, 'ring')
  new NotGate(w, w)
  w[0].propagateSignal(0)
  t.throws(() => simulator.run(), { message: /did not settle.*ring\[0\]/ })
})

test('Clock : SR-Flip-Flop ignores inputs until the next rising edge', t => {
  const s = wires(1), r = wires(1), qqbar = wires(2)
  const clock = new Clock(0)
  new SRFlipFlop(s, r, qqbar, clock)
  drive([s, 1], [r, 0])
  clock.tick() // clock -> 1
  t.is(qqbar[0].getSignal(), 1)
  drive([s, 0], [r, 1])
  t.is(qqbar[0].getSignal(), 1, 'clock high: reset not applied')
  clock.tick() // clock -> 0
  t.is(qqbar[0].getSignal(), 1, 'clock low: reset not applied')
  clock.tick() // clock -> 1, reset now takes effect
  t.is(qqbar[0].getSignal(), 0)
})
