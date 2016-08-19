import test from 'ava'
import { wires, Pulse } from './Connectors/transport'
import { NotGate, AndGate, TriInpAndGate, XorGate } from './Combinational/gates'
import { PipoAdder, HalfAdder, FullAdder } from './Combinational/arithmetics'
import { SRFlipFlop } from './Sequential/ff'
import { StringIO } from './Utility/ioManager'


test('Not-Gate : 1', t => {
  let a = wires(1)
  let o = wires(1)
  let hWare = new NotGate(a, o)
  let c = new StringIO(hWare)
  t.is(c.resultOf('1'), '0')
})

test('Not-Gate : 2', t => {
  let a = wires(1)
  let o = wires(1)
  let hWare = new NotGate(a, o)
  let c = new StringIO(hWare)
  t.is(c.resultOf('0'), '1')
})

test('And-Gate : 1', t => {
  let a = wires(2)
  let o = wires(1)
  let hWare = new AndGate(a, o)
  let c = new StringIO(hWare)
  t.is(c.resultOf('00'), '0')
})

test('And-Gate : 2', t => {
  let a = wires(2)
  let o = wires(1)
  let hWare = new AndGate(a, o)
  let c = new StringIO(hWare)
  t.is(c.resultOf('01'), '0')
})

test('And-Gate : 3', t => {
  let a = wires(2)
  let o = wires(1)
  let hWare = new AndGate(a, o)
  let c = new StringIO(hWare)
  t.is(c.resultOf('11'), '1')
})

test('And-Gate : 4', t => {
  let a = wires(3)
  let o = wires(1)
  let hWare = new TriInpAndGate(a, o)
  let c = new StringIO(hWare)
  t.is(c.resultOf('111'), '1')
})

test('Xor-Gate : 1', t => {
  let a = wires(2)
  let o = wires(1)
  let hWare = new XorGate(a, o)
  let c = new StringIO(hWare)
  t.is(c.resultOf('11'), '0')
})

test('Xor-Gate : 2', t => {
  let a = wires(2)
  let o = wires(1)
  let hWare = new XorGate(a, o)
  let c = new StringIO(hWare)
  t.is(c.resultOf('01'), '1')
})

test('Overflow for HalfAdder', t => {
  let a = wires(2)
  let s = wires(2)
  let hWare = new HalfAdder(a, s)
  let c = new StringIO(hWare)
  t.is(c.resultOf('11'), '10')
})

test('Overflow for FullAdder', t => {
  let a = wires(3)
  let s = wires(2)
  let hWare = new FullAdder(a, s)
  let c = new StringIO(hWare)
  t.is(c.resultOf('111'), '11')
})

test('Overflow for Parallel Adder (1 bit)', t => {
  let a = wires(1)
  let b = wires(1)
  let s = wires(2)
  let hWare = new PipoAdder(a, b, s)
  let c = new StringIO(hWare)
  t.is(c.resultOf('1', '1'), '10')
})

test('Overflow for Parallel Adder (2 bit)', t => {
  let a = wires(2)
  let b = wires(2)
  let s = wires(3)
  let hWare = new PipoAdder(a, b, s)
  let c = new StringIO(hWare)
  t.is(c.resultOf('11', '11'), '110')
})

test('Overflow for Parallel Adder (4 bit)', t => {
  let a = wires(4)
  let b = wires(4)
  let s = wires(5)
  let hWare = new PipoAdder(a, b, s)
  let c = new StringIO(hWare)
  t.is(c.resultOf('1111', '1111'), '11110')
})

test('HalfAdder - 1 bit PIPO Equivalence : 1', t => {
  let a = wires(1)
  let b = wires(1)
  let s1 = wires(2)
  let i = wires(2)
  let s2 = wires(2)
  let hWare1 = new PipoAdder(a, b, s1)
  let hWare2 = new HalfAdder(i, s2)
  let c1 = new StringIO(hWare1)
  let c2 = new StringIO(hWare2)
  t.is(c1.resultOf('1', '1'), c2.resultOf('11'))
})

test('HalfAdder - 1 bit PIPO Equivalence : 2', t => {
  let a = wires(1)
  let b = wires(1)
  let s1 = wires(2)
  let i = wires(2)
  let s2 = wires(2)
  let hWare1 = new PipoAdder(a, b, s1)
  let hWare2 = new HalfAdder(i, s2)
  let c1 = new StringIO(hWare1)
  let c2 = new StringIO(hWare2)
  t.is(c1.resultOf('1', '0'), c2.resultOf('10'))
})

test('HalfAdder - 1 bit PIPO Equivalence : 3', t => {
  let a = wires(1)
  let b = wires(1)
  let s1 = wires(2)
  let i = wires(2)
  let s2 = wires(2)
  let hWare1 = new PipoAdder(a, b, s1)
  let hWare2 = new HalfAdder(i, s2)
  let c1 = new StringIO(hWare1)
  let c2 = new StringIO(hWare2)
  t.is(c1.resultOf('0', '0'), c2.resultOf('00'))
})

test('SR-Flip-Flip : Set', t => {
  let sr = wires(2)
  let qqbar = wires(2)
  let clock = new Pulse(500, 1)
  clock.switchOn()
  let ff = new SRFlipFlop(sr, qqbar, clock)
  let c = new StringIO(ff)
  t.is(c.resultOf('01'), '1')
  clock.switchOff()
})

test('SR-Flip-Flip : Reset', t => {
  let sr = wires(2)
  let qqbar = wires(2)
  let clock = new Pulse(500, 1)
  clock.switchOn()
  let ff = new SRFlipFlop(sr, qqbar, clock)
  let c = new StringIO(ff)
  t.is(c.resultOf('10'), '0')
  clock.switchOff()
})

test('SR-Flip-Flip : No Change', t => {
  let sr = wires(2)
  let qqbar = wires(2)
  let clock = new Pulse(500, 1)
  clock.switchOn()
  let ff = new SRFlipFlop(sr, qqbar, clock)
  let c = new StringIO(ff)
  let prevQ = c.resultOf('01')
  t.is(c.resultOf('00'), prevQ)
  clock.switchOff()
})
