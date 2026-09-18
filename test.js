const test = require('ava').default
const { wires, Pulse, Clock, simulator, constant } = require('./Connectors/transport')
const { NotGate, AndGate, TriInpAndGate, XorGate, Buffer, BitwiseAnd, BitwiseOr, BitwiseXor, BitwiseNot } = require('./Combinational/gates')
const { PipoAdder, PipoSubtractor, HalfAdder, FullAdder, Incrementer } = require('./Combinational/arithmetics')
const { SRLatch, DLatch, SRFlipFlop, DFlipFlop } = require('./Sequential/ff')
const { Register, ShiftRegister, RegisterFile } = require('./Sequential/registers')
const { Counter, ProgramCounter } = require('./Sequential/counters')
const { RAM, ROM } = require('./Sequential/memory')
const { CPU } = require('./Sequential/cpu')
const { StringIO } = require('./Utility/ioManager')
const { Decoder1x2, Decoder2x4, DecoderNxM } = require('./Combinational/decoders')
const { Encoder4x2 } = require('./Combinational/encoders')
const { Mux2x1, Mux4x1, MuxNx1, Demux1x2 } = require('./Combinational/multiplexers')
const { Comparator } = require('./Combinational/comparators')
const { ALU } = require('./Combinational/alu')

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

test('Simulator : a gate attached to wires that already carry a signal evaluates', t => {
  const a = wires(1), b = wires(1), o = wires(1)
  a[0].propagateSignal(1); b[0].propagateSignal(1); simulator.run()
  new AndGate(a, b, o)
  simulator.run()
  t.is(o[0].getSignal(), 1)
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

test('Bitwise gates : operate per bit over a bus', t => {
  const a = wires(4), b = wires(4)
  const cases = [[BitwiseAnd, '1000'], [BitwiseOr, '1110'], [BitwiseXor, '0110']]
  for (const [Gate, expected] of cases) {
    const o = wires(4)
    t.is(new StringIO(new Gate(a, b, o)).input('1100', '1010'), expected, Gate.name)
  }
  const o = wires(4)
  t.is(new StringIO(new BitwiseNot(a, o)).input('1100'), '0011')
})

// ALU output prints as: zero carry result
test('ALU : ADD', t => {
  const a = wires(4), b = wires(4), op = wires(2), r = wires(4), f = wires(2)
  const ioHandler = new StringIO(new ALU(a, b, op, r, f))
  t.is(ioHandler.input('0101', '0011', ALU.ADD), '00' + '1000')
  t.is(ioHandler.input('1111', '0001', ALU.ADD), '11' + '0000', 'wraps: zero and carry set')
})

test('ALU : SUB sets carry when a >= b and zero when equal', t => {
  const a = wires(4), b = wires(4), op = wires(2), r = wires(4), f = wires(2)
  const ioHandler = new StringIO(new ALU(a, b, op, r, f))
  t.is(ioHandler.input('1001', '0011', ALU.SUB), '01' + '0110')
  t.is(ioHandler.input('0011', '1001', ALU.SUB), '00' + '1010', 'borrow: carry clear')
  t.is(ioHandler.input('0101', '0101', ALU.SUB), '11' + '0000')
})

test('ALU : AND and OR never set carry', t => {
  const a = wires(4), b = wires(4), op = wires(2), r = wires(4), f = wires(2)
  const ioHandler = new StringIO(new ALU(a, b, op, r, f))
  t.is(ioHandler.input('1100', '1010', ALU.AND), '00' + '1000')
  t.is(ioHandler.input('1100', '1010', ALU.OR), '00' + '1110')
  t.is(ioHandler.input('1111', '1111', ALU.AND), '00' + '1111', 'no carry even when all bits set')
  t.is(ioHandler.input('0000', '0000', ALU.OR), '10' + '0000')
})

test('ALU : 1-bit', t => {
  const a = wires(1), b = wires(1), op = wires(2), r = wires(1), f = wires(2)
  const ioHandler = new StringIO(new ALU(a, b, op, r, f))
  t.is(ioHandler.input('1', '1', ALU.ADD), '11' + '0')
  t.is(ioHandler.input('1', '0', ALU.SUB), '01' + '1')
})

test('ALU : op change alone re-selects the result', t => {
  const a = wires(4), b = wires(4), op = wires(2), r = wires(4), f = wires(2)
  new ALU(a, b, op, r, f)
  const ioHandler = new StringIO({ ioMapping: [a, b, op, r] })
  t.is(ioHandler.input('0110', '0011', ALU.ADD), '1001')
  t.is(ioHandler.input('0110', '0011', ALU.SUB), '0011')
  t.is(ioHandler.input('0110', '0011', ALU.AND), '0010')
})

test('DecoderNxM : one-hot line at the binary index of x', t => {
  const x = wires(3), o = wires(8)
  const ioHandler = new StringIO(new DecoderNxM(x, o))
  for (let k = 0; k < 8; k++) {
    const expected = '1'.padStart(8 - k, '0').padEnd(8, '0')
    t.is(ioHandler.input(k.toString(2).padStart(3, '0')), expected)
  }
})

test('DecoderNxM : 1-bit matches Decoder1x2, 2-bit matches Decoder2x4', t => {
  const x1 = wires(1), o1 = wires(2)
  const d1 = new StringIO(new DecoderNxM(x1, o1))
  t.is(d1.input('0'), '01')
  t.is(d1.input('1'), '10')
  const x2 = wires(2), o2 = wires(4)
  const d2 = new StringIO(new DecoderNxM(x2, o2))
  t.is(d2.input('00'), '0001')
  t.is(d2.input('01'), '0010')
  t.is(d2.input('10'), '0100')
  t.is(d2.input('11'), '1000')
})

test('DecoderNxM : enable forces every line low', t => {
  const x = wires(2), en = wires(1), o = wires(4)
  const ioHandler = new StringIO(new DecoderNxM(x, o, en))
  t.is(ioHandler.input('10', '1'), '0100')
  t.is(ioHandler.input('10', '0'), '0000')
  t.is(ioHandler.input('11', '1'), '1000')
})

test('DecoderNxM -> Encoder4x2 round-trips', t => {
  const x = wires(2), lines = wires(4), o = wires(2)
  new DecoderNxM(x, lines)
  new Encoder4x2(lines, o)
  const ioHandler = new StringIO({ ioMapping: [x, o] })
  for (const k of ['00', '01', '10', '11']) t.is(ioHandler.input(k), k)
})

test('RAM : write on the rising edge with we high, read asynchronously', t => {
  const addr = wires(2), din = wires(4), we = wires(1), dout = wires(4), clock = new Clock(0)
  const ram = new RAM(addr, din, we, dout, clock)
  t.is(ram.clock, clock)
  const ioHandler = new StringIO(ram)
  t.is(ioHandler.input('00', '1010', '1'), '', 'undefined before the first write')
  clock.tick(); clock.tick()
  t.is(ioHandler.input('00', '0000', '0'), '1010')
  ioHandler.input('11', '0110', '1'); clock.tick(); clock.tick()
  ioHandler.input('01', '1111', '1'); clock.tick(); clock.tick()
  t.is(ioHandler.input('00', '0000', '0'), '1010')
  t.is(ioHandler.input('01', '0000', '0'), '1111')
  t.is(ioHandler.input('11', '0000', '0'), '0110')
  t.is(ioHandler.input('10', '0000', '0'), '', 'never written')
})

test('RAM : we low holds every word; writes wait for the edge', t => {
  const addr = wires(1), din = wires(2), we = wires(1), dout = wires(2), clock = new Clock(0)
  const ioHandler = new StringIO(new RAM(addr, din, we, dout, clock))
  ioHandler.input('0', '01', '1'); clock.tick(); clock.tick()
  ioHandler.input('1', '10', '1'); clock.tick(); clock.tick()
  t.is(ioHandler.input('0', '11', '0'), '01')
  clock.tick(); clock.tick()
  t.is(ioHandler.input('0', '11', '0'), '01', 'we low: no write')
  t.is(ioHandler.input('0', '11', '1'), '01', 'we high but no edge yet')
  clock.tick()
  t.is(read(dout), '11', 'written on the rising edge')
  t.is(ioHandler.input('1', '11', '0'), '10', 'other word untouched')
})

test('RAM : overwrite and 8 x 8 sweep', t => {
  const addr = wires(3), din = wires(8), we = wires(1), dout = wires(8), clock = new Clock(0)
  const ioHandler = new StringIO(new RAM(addr, din, we, dout, clock))
  const word = (k) => (k * 37 % 256).toString(2).padStart(8, '0')
  for (let k = 0; k < 8; k++) {
    ioHandler.input(k.toString(2).padStart(3, '0'), word(k), '1')
    clock.tick(); clock.tick()
  }
  for (let k = 0; k < 8; k++) {
    t.is(ioHandler.input(k.toString(2).padStart(3, '0'), '00000000', '0'), word(k))
  }
  ioHandler.input('101', '11111111', '1'); clock.tick(); clock.tick()
  t.is(ioHandler.input('101', '00000000', '0'), '11111111')
  t.is(ioHandler.input('100', '00000000', '0'), word(4))
})

test('Composition : Counter addresses a RAM', t => {
  const clock = new Clock(0)
  const reset = wires(1), addr = wires(2), din = wires(2), we = wires(1), dout = wires(2)
  new Counter(reset, addr, clock)
  new RAM(addr, din, we, dout, clock)
  const ioHandler = new StringIO({ ioMapping: [reset, din, we, dout] })
  ioHandler.input('1', '00', '0'); clock.tick(); clock.tick()
  // walk the addresses, storing each address's complement at it
  for (const value of ['11', '10', '01', '00']) {
    ioHandler.input('0', value, '1')
    clock.tick(); clock.tick()
  }
  const trace = []
  for (let k = 0; k < 4; k++) {
    trace.push(ioHandler.input('0', '00', '0'))
    clock.tick(); clock.tick()
  }
  t.deepEqual(trace, ['11', '10', '01', '00'])
})

test('Buffer and constant', t => {
  const x = wires(1), o = wires(1)
  const ioHandler = new StringIO(new Buffer(x, o))
  t.is(ioHandler.input('1'), '1')
  t.is(ioHandler.input('0'), '0')
  const vcc = constant(1), gnd = constant(0), y = wires(2)
  new Buffer([vcc], [y[0]]); new Buffer([gnd], [y[1]])
  simulator.run()
  t.is(read(y), '01')
  t.is(vcc.name, 'vcc'); t.is(gnd.name, 'gnd')
})

test('Incrementer : a + 1 mod 2^N', t => {
  const a = wires(4), o = wires(4)
  const ioHandler = new StringIO(new Incrementer(a, o))
  t.is(ioHandler.input('0000'), '0001')
  t.is(ioHandler.input('0111'), '1000')
  t.is(ioHandler.input('1110'), '1111')
  t.is(ioHandler.input('1111'), '0000', 'wraps')
  const a1 = wires(1), o1 = wires(1)
  const one = new StringIO(new Incrementer(a1, o1))
  t.is(one.input('0'), '1'); t.is(one.input('1'), '0')
})

test('MuxNx1 : o = inputs[s] over 8 buses', t => {
  const inputs = []
  for (let k = 0; k < 8; k++) inputs.push(wires(3))
  const s = wires(3), o = wires(3)
  const ioHandler = new StringIO(new MuxNx1(inputs, s, o))
  const values = ['000', '001', '010', '011', '100', '101', '110', '111']
  for (let k = 0; k < 8; k++) t.is(ioHandler.input(...values, values[k]), values[k])
  t.throws(() => new MuxNx1(inputs.slice(0, 6), s, o))
})

test('Register : with enable, holds on edges where en is low', t => {
  const d = wires(4), en = wires(1), q = wires(4), clock = new Clock(0)
  const ioHandler = new StringIO(new Register(d, q, clock, en))
  ioHandler.input('1010', '1'); clock.tick(); clock.tick()
  t.is(read(q), '1010')
  ioHandler.input('0101', '0'); clock.tick(); clock.tick()
  t.is(read(q), '1010', 'en low: held')
  ioHandler.input('0101', '1'); clock.tick()
  t.is(read(q), '0101')
})

test('RegisterFile : two read ports, one write port', t => {
  const ra = wires(2), rb = wires(2), wa = wires(2), wd = wires(4), we = wires(1)
  const qa = wires(4), qb = wires(4), clock = new Clock(0)
  const rf = new RegisterFile(ra, rb, wa, wd, we, qa, qb, clock)
  const ioHandler = new StringIO(rf)
  for (const [k, v] of [['00', '0001'], ['01', '0010'], ['10', '0100'], ['11', '1000']]) {
    ioHandler.input('00', '00', k, v, '1'); clock.tick(); clock.tick()
  }
  // output string is: qb qa
  t.is(ioHandler.input('01', '10', '00', '0000', '0'), '0100' + '0010')
  t.is(ioHandler.input('11', '11', '00', '0000', '0'), '1000' + '1000', 'both ports may read the same register')
  ioHandler.input('00', '00', '01', '1111', '0'); clock.tick(); clock.tick()
  t.is(read(rf.registers[1]), '0010', 'we low: not written')
  ioHandler.input('01', '00', '01', '1111', '1'); clock.tick()
  t.is(read(qa), '1111', 'read port shows the new value right after the edge')
})

test('ProgramCounter : reset > load > enable > hold', t => {
  const d = wires(4), load = wires(1), en = wires(1), reset = wires(1), q = wires(4), clock = new Clock(0)
  const ioHandler = new StringIO(new ProgramCounter(d, load, en, reset, q, clock))
  ioHandler.input('0000', '0', '0', '1'); clock.tick(); clock.tick()
  t.is(read(q), '0000')
  ioHandler.input('0000', '0', '1', '0'); clock.tick(); clock.tick(); clock.tick(); clock.tick()
  t.is(read(q), '0010', 'increments while enabled')
  ioHandler.input('1010', '1', '0', '0'); clock.tick(); clock.tick()
  t.is(read(q), '1010', 'load works without en')
  ioHandler.input('0000', '0', '0', '0'); clock.tick(); clock.tick()
  t.is(read(q), '1010', 'holds when neither')
  ioHandler.input('0110', '1', '1', '1'); clock.tick(); clock.tick()
  t.is(read(q), '0000', 'reset wins')
})

test('ROM : o = contents[addr], missing words read 0', t => {
  const addr = wires(2), o = wires(4)
  const rom = new ROM(addr, o, ['1001', 6, '1111'])
  const ioHandler = new StringIO(rom)
  t.is(ioHandler.input('00'), '1001')
  t.is(ioHandler.input('01'), '0110')
  t.is(ioHandler.input('10'), '1111')
  t.is(ioHandler.input('11'), '0000')
  t.throws(() => new ROM(addr, o, ['10000']), { message: /Invalid ROM word/ })
  t.throws(() => new ROM(addr, o, [1, 2, 3, 4, 5]))
})

test('gateCount : primitives count 1, composites sum their parts', t => {
  t.is(new AndGate(wires(1), wires(1), wires(1)).gateCount(), 1)
  t.is(new HalfAdder(wires(2), wires(2)).gateCount(), 2)
  t.is(new FullAdder(wires(3), wires(2)).gateCount(), 5)
  t.is(new DFlipFlop(wires(1), wires(2), new Clock(0)).gateCount(), 11)
  t.is(new DecoderNxM(wires(3), wires(8)).gateCount(), 3 + 14)
})

test('CPU.assemble : encodes fields as op(4) rd(2) rs(2) imm(8) and resolves labels', t => {
  t.is(CPU.encode('LDI', 2, 0, 5), '0001' + '10' + '00' + '00000101')
  t.deepEqual(CPU.assemble(`
    start: LDI r1, 3   ; comment
           BNE r1, r0, start
           HLT
  `), [
    '0001010000000011',
    '1011010000000000',
    '1100000000000000'
  ])
  t.throws(() => CPU.assemble('MUL r0, r1'), { message: /Unknown instruction/ })
  t.throws(() => CPU.assemble('LDI r4, 1'), { message: /Expected a register/ })
  t.throws(() => CPU.assemble('JMP nowhere'), { message: /number or label/ })
})

// Build a CPU with a 16-word ROM and a 32-byte RAM, reset it, and run until
// halt. Returns the machine so tests can inspect registers and memory.
const machine = (source) => {
  const clock = new Clock(0)
  const reset = wires(1), instr = wires(16), dataIn = wires(8), pc = wires(8)
  const addr = wires(8), dataOut = wires(8), we = wires(1), halt = wires(1)
  const cpu = new CPU(reset, instr, dataIn, pc, addr, dataOut, we, halt, clock)
  const rom = new ROM(pc.slice(0, 4), instr, CPU.assemble(source))
  const ram = new RAM(addr.slice(0, 5), dataOut, we, dataIn, clock)
  drive([reset, 1]); clock.tick(); clock.tick()
  drive([reset, 0])
  let cycles = 0
  while (halt[0].getSignal() !== 1 && cycles < 500) { clock.tick(); clock.tick(); cycles++ }
  const reg = (k) => parseInt(read(cpu.registers.registers[k]), 2)
  const mem = (k) => parseInt(read(ram.words[k]), 2)
  return { cpu, rom, ram, pc, halt, cycles, reg, mem }
}

test('CPU : LDI, ADD, SUB, AND, OR, ADDI', t => {
  const m = machine(`
    LDI r0, 12
    LDI r1, 10
    ADD r0, r1     ; 22
    SUB r1, r0     ; 10 - 22 = 244 (mod 256)
    LDI r2, 12
    AND r2, r1     ; 12 & 244 = 4
    LDI r3, 3
    OR r3, r2      ; 3 | 4 = 7
    ADDI r0, 250   ; 22 + 250 = 16 (wraps)
    HLT
  `)
  t.is(m.halt[0].getSignal(), 1)
  t.deepEqual([m.reg(0), m.reg(1), m.reg(2), m.reg(3)], [16, 244, 4, 7])
  t.is(m.cycles, 9)
  t.is(read(m.pc), '00001001', 'pc holds at HLT')
})

test('CPU : ST / LD round-trip through RAM', t => {
  const m = machine(`
    LDI r0, 7
    LDI r1, 20
    ST r0, [r1]
    LDI r0, 0
    LD r2, [r1]
    ADDI r1, 1
    ST r2, [r1]
    HLT
  `)
  t.is(m.mem(20), 7)
  t.is(m.mem(21), 7)
  t.is(m.reg(2), 7)
  t.is(m.reg(0), 0)
})

test('CPU : loop with BEQ / JMP sums 1..5 and stores it', t => {
  const m = machine(`
      LDI r0, 0        ; acc
      LDI r1, 5        ; n
      LDI r2, 0
      LDI r3, 1
    loop:
      BEQ r1, r2, done
      ADD r0, r1
      SUB r1, r3
      JMP loop
    done:
      LDI r1, 16
      ST r0, [r1]
      HLT
  `)
  t.is(m.reg(0), 15)
  t.is(m.mem(16), 15)
  t.is(m.cycles, 4 + 5 * 4 + 3)
})

test('CPU : BNE loop and untaken branches fall through', t => {
  const m = machine(`
      LDI r0, 0
      LDI r1, 3
      LDI r2, 0
      LDI r3, 1
    loop:
      ADDI r0, 2
      SUB r1, r3
      BNE r1, r2, loop
      BEQ r0, r1, 20   ; 6 != 0: not taken
      BNE r0, r0, 20   ; equal: not taken
      HLT
  `)
  t.is(m.reg(0), 6)
  t.is(m.halt[0].getSignal(), 1)
})

test('CPU : HLT is sticky and nothing writes during reset', t => {
  const m = machine(`
    LDI r0, 1
    HLT
    LDI r0, 2
  `)
  t.is(m.reg(0), 1)
  t.is(m.cycles, 1, 'one instruction executes before HLT is fetched')
  for (let k = 0; k < 4; k++) { m.cpu.clock.tick(); m.cpu.clock.tick() }
  t.is(m.reg(0), 1, 'still halted')
  t.is(read(m.pc), '00000001')
})
