const test = require('ava').default
const { wires, Pulse, Clock, simulator } = require('./Connectors/transport')
const { NotGate, AndGate, TriInpAndGate, XorGate } = require('./Combinational/gates')
const { PipoAdder, PipoSubtractor, HalfAdder, FullAdder } = require('./Combinational/arithmetics')
const { SRLatch, DLatch, SRFlipFlop, DFlipFlop } = require('./Sequential/ff')
const { Register, ShiftRegister } = require('./Sequential/registers')
const { Counter } = require('./Sequential/counters')
const { StringIO } = require('./Utility/ioManager')
const { Decoder1x2, Decoder2x4 } = require('./Combinational/decoders')
const { Encoder4x2 } = require('./Combinational/encoders')
const { Mux2x1, Mux4x1, Demux1x2 } = require('./Combinational/multiplexers')
const { Comparator } = require('./Combinational/comparators')

// Read a bus as a binary string, MSB first (wire[0] is the LSB).
const read = (bus) => bus.map((w) => w.getSignal()).reverse().join('')


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
  t.is(ioHandler.input('0', '0'), '0001')
})

test('2x4 Decoder : 2', t => {
  const inputX = wires(1)
  const inputY = wires(1)
  const output = wires(4)
  const d2x4 = new Decoder2x4(inputX, inputY, output)
  const ioHandler = new StringIO(d2x4)
  t.is(ioHandler.input('1' ,'0'), '0100')
})

test('2x4 Decoder : 3', t => {
  const inputX = wires(1)
  const inputY = wires(1)
  const output = wires(4)
  const d2x4 = new Decoder2x4(inputX, inputY, output)
  const ioHandler = new StringIO(d2x4)
  t.is(ioHandler.input('1', '1'), '1000')
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

test('StringIO : rejects wrong argument count and width', t => {
  const a = wires(2), b = wires(1), o = wires(3)
  const ioHandler = new StringIO(new PipoAdder(a, wires(2), o))
  t.throws(() => ioHandler.input('11'), { message: /Expected 2 input/ })
  t.throws(() => ioHandler.input('111', '11'), { message: /Input 0 is 2 wire/ })
})

test('StringIO : wire[0] is the LSB on both inputs and outputs', t => {
  const a = wires(4), b = wires(4), s = wires(5)
  const ioHandler = new StringIO(new PipoAdder(a, b, s))
  t.is(ioHandler.input('0001', '0000'), '00001')
  t.is(a[0].getSignal(), 1, 'rightmost char drives wire[0]')
  t.is(s[0].getSignal(), 1, 'wire[0] prints rightmost')
  t.is(ioHandler.input('1000', '1000'), '10000')
  t.is(s[4].getSignal(), 1, 'carry out is the top wire')
})

test('Subtractor : no borrow when a >= b', t => {
  const a = wires(4), b = wires(4), d = wires(5)
  const ioHandler = new StringIO(new PipoSubtractor(a, b, d))
  t.is(ioHandler.input('1001', '0011'), '10110') // 9 - 3 = 6
  t.is(ioHandler.input('0101', '0101'), '10000') // 5 - 5 = 0
})

test('Subtractor : borrow and wrap when a < b', t => {
  const a = wires(4), b = wires(4), d = wires(5)
  const ioHandler = new StringIO(new PipoSubtractor(a, b, d))
  t.is(ioHandler.input('0011', '1001'), '01010') // 3 - 9 = -6 = 10 mod 16
})

test('Mux2x1 : selects between two buses', t => {
  const a = wires(3), b = wires(3), s = wires(1), o = wires(3)
  const ioHandler = new StringIO(new Mux2x1(a, b, s, o))
  t.is(ioHandler.input('101', '010', '0'), '101')
  t.is(ioHandler.input('101', '010', '1'), '010')
})

test('Mux4x1 : s is the binary index of the selected input', t => {
  const inputs = [wires(1), wires(1), wires(1), wires(1)]
  const s = wires(2), o = wires(1)
  const ioHandler = new StringIO(new Mux4x1(...inputs, s, o))
  t.is(ioHandler.input('1', '0', '0', '0', '00'), '1')
  t.is(ioHandler.input('0', '1', '0', '0', '01'), '1')
  t.is(ioHandler.input('0', '0', '1', '0', '10'), '1')
  t.is(ioHandler.input('0', '0', '0', '1', '11'), '1')
  t.is(ioHandler.input('1', '1', '0', '1', '10'), '0')
})

test('Demux1x2 : routes the input to one output, other is 0', t => {
  const i = wires(2), s = wires(1), o0 = wires(2), o1 = wires(2)
  new Demux1x2(i, s, o0, o1)
  const ioHandler = new StringIO({ ioMapping: [i, s, []] })
  ioHandler.input('11', '0')
  t.is(read(o0), '11'); t.is(read(o1), '00')
  ioHandler.input('11', '1')
  t.is(read(o0), '00'); t.is(read(o1), '11')
})

test('Encoder4x2 : one-hot input to binary index', t => {
  const i = wires(4), o = wires(2)
  const ioHandler = new StringIO(new Encoder4x2(i, o))
  t.is(ioHandler.input('0001'), '00')
  t.is(ioHandler.input('0010'), '01')
  t.is(ioHandler.input('0100'), '10')
  t.is(ioHandler.input('1000'), '11')
})

test('Decoder2x4 -> Encoder4x2 round-trips without reversing', t => {
  const x0 = wires(1), x1 = wires(1), lines = wires(4), o = wires(2)
  new Decoder2x4(x0, x1, lines)
  new Encoder4x2(lines, o)
  const ioHandler = new StringIO({ ioMapping: [x0, x1, o] })
  // Decoder2x4 takes x0 as the high bit
  t.is(ioHandler.input('0', '1'), '01')
  t.is(ioHandler.input('1', '0'), '10')
  t.is(ioHandler.input('1', '1'), '11')
})

test('Comparator : o = [lt, eq, gt]', t => {
  const a = wires(3), b = wires(3), o = wires(3)
  const ioHandler = new StringIO(new Comparator(a, b, o))
  // printed MSB-first, so the string reads gt eq lt
  t.is(ioHandler.input('011', '101'), '001')
  t.is(ioHandler.input('101', '101'), '010')
  t.is(ioHandler.input('110', '010'), '100')
  t.is(ioHandler.input('000', '000'), '010')
  t.is(ioHandler.input('111', '000'), '100')
})

test('Comparator : 1-bit', t => {
  const a = wires(1), b = wires(1), o = wires(1 + 2)
  const ioHandler = new StringIO(new Comparator(a, b, o))
  t.is(ioHandler.input('0', '1'), '001')
  t.is(ioHandler.input('1', '1'), '010')
  t.is(ioHandler.input('1', '0'), '100')
})

test('Register : loads on the rising edge only', t => {
  const d = wires(4), q = wires(4), clock = new Clock(0)
  const reg = new Register(d, q, clock)
  t.is(reg.clock, clock)
  const ioHandler = new StringIO(reg)
  t.is(ioHandler.input('1010'), '', 'undefined before the first edge')
  clock.tick()
  t.is(ioHandler.input('1010'), '1010')
  t.is(ioHandler.input('0101'), '1010', 'held while clock is high')
  clock.tick()
  t.is(ioHandler.input('0101'), '1010', 'held on the falling edge')
  clock.tick()
  t.is(read(q), '0101')
})

test('ShiftRegister : serial in enters at bit 0 and shifts up', t => {
  const sin = wires(1), q = wires(4), clock = new Clock(0)
  const ioHandler = new StringIO(new ShiftRegister(sin, q, clock))
  ioHandler.input('0')
  for (let k = 0; k < 8; k++) clock.tick()
  t.is(read(q), '0000')
  const trace = []
  for (const bit of ['1', '1', '0', '1']) {
    ioHandler.input(bit)
    clock.tick(); clock.tick()
    trace.push(read(q))
  }
  t.deepEqual(trace, ['0001', '0011', '0110', '1101'])
  ioHandler.input('0')
  clock.tick(); clock.tick()
  t.is(read(q), '1010', 'top bit falls off')
})

test('Counter : counts up on each rising edge and wraps', t => {
  const reset = wires(1), q = wires(3), clock = new Clock(0)
  const ioHandler = new StringIO(new Counter(reset, q, clock))
  ioHandler.input('1')
  clock.tick(); clock.tick()
  const trace = [ioHandler.input('0')]
  for (let k = 0; k < 8; k++) {
    clock.tick(); clock.tick()
    trace.push(ioHandler.input('0'))
  }
  t.deepEqual(trace, ['000', '001', '010', '011', '100', '101', '110', '111', '000'])
})

test('Counter : synchronous reset', t => {
  const reset = wires(1), q = wires(2), clock = new Clock(0)
  const ioHandler = new StringIO(new Counter(reset, q, clock))
  ioHandler.input('1'); clock.tick(); clock.tick()
  ioHandler.input('0'); clock.tick(); clock.tick(); clock.tick(); clock.tick()
  t.is(read(q), '10')
  ioHandler.input('1')
  t.is(read(q), '10', 'reset waits for the edge')
  clock.tick()
  t.is(read(q), '00')
})

test('Composition : Counter -> PipoAdder -> Register with no bit reversing', t => {
  const clock = new Clock(0)
  const reset = wires(1), count = wires(3), five = wires(3), sum = wires(4), latched = wires(4)
  new Counter(reset, count, clock)
  new PipoAdder(count, five, sum)
  new Register(sum, latched, clock)
  five.forEach((w, i) => w.propagateSignal([1, 0, 1][i]))
  reset[0].propagateSignal(1); simulator.run(); clock.tick(); clock.tick()
  reset[0].propagateSignal(0); simulator.run()
  clock.tick(); clock.tick()
  t.is(read(count), '001')
  t.is(read(sum), '0110')
  t.is(read(latched), '0101', 'register latched the previous sum at the same edge')
  clock.tick(); clock.tick()
  t.is(read(count), '010')
  t.is(read(sum), '0111')
  t.is(read(latched), '0110')
})
