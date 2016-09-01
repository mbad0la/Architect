import test from 'ava'
import { wires, Pulse } from './Connectors/transport'
import { NotGate, AndGate, TriInpAndGate, XorGate } from './Combinational/gates'
import { PipoAdder, HalfAdder, FullAdder } from './Combinational/arithmetics'
import { SRFlipFlop, TFlipFlop } from './Sequential/ff'
import { StringIO } from './Utility/ioManager'
import { Decoder1x2, Decoder2x4 } from './Combinational/decoders'


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

test('SR-Flip-Flip : Set', t => {
  const s = wires(1)
  const r = wires(1)
  const qqbar = wires(2)
  const clock = new Pulse(500, 1)
  clock.switchOn()
  const ff = new SRFlipFlop(s, r, qqbar, clock)
  const ioHandler = new StringIO(ff)
  t.is(ioHandler.input('1', '0'), '1')
  clock.switchOff()
})

test('SR-Flip-Flip : Reset', t => {
  const s = wires(1)
  const r = wires(1)
  const qqbar = wires(2)
  const clock = new Pulse(500, 1)
  clock.switchOn()
  const ff = new SRFlipFlop(s, r, qqbar, clock)
  const ioHandler = new StringIO(ff)
  t.is(ioHandler.input('0', '1'), '0')
  clock.switchOff()
})

test('SR-Flip-Flip : No Change', t => {
  const s = wires(1)
  const r = wires(1)
  const qqbar = wires(2)
  const clock = new Pulse(500, 1)
  clock.switchOn()
  const ff = new SRFlipFlop(s, r, qqbar, clock)
  const ioHandler = new StringIO(ff)
  const prevQ = ioHandler.input('0', '1')
  t.is(ioHandler.input('0', '0'), prevQ)
  clock.switchOff()
})

test('T-Flip-Flip: 1', t => {
  const T = wires(1)
  const qqbar = wires(2)
  const clock = new Pulse(500, 1)
  clock.switchOn()
  const ff = new TFlipFlop(T, qqbar, clock)
  const ioHandler = new StringIO(ff)
  t.is(ioHandler.input('1'), '1')
  clock.switchOff()
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
