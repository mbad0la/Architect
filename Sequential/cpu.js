const { AndGate, OrGate, NotGate, Buffer } = require('../Combinational/gates')
const { DecoderNxM } = require('../Combinational/decoders')
const { Mux2x1, Mux4x1 } = require('../Combinational/multiplexers')
const { ALU } = require('../Combinational/alu')
const { RegisterFile } = require('./registers')
const { ProgramCounter } = require('./counters')
const { wires } = require('../Connectors/transport')
const { Hardware } = require('../Utility/new')

// A single-cycle 8-bit CPU with four registers. Every instruction is one
// 16-bit word, written MSB first:
//
//   op(4) rd(2) rs(2) imm(8)
//
//   NOP                    0
//   LDI  rd, imm           1   rd <= imm
//   LD   rd, [rs]          2   rd <= mem[rs]
//   ST   rd, [rs]          3   mem[rs] <= rd
//   ADD  rd, rs            4   rd <= rd + rs
//   SUB  rd, rs            5   rd <= rd - rs
//   AND  rd, rs            6   rd <= rd & rs
//   OR   rd, rs            7   rd <= rd | rs
//   ADDI rd, imm           8   rd <= rd + imm
//   JMP  imm               9   pc <= imm
//   BEQ  rd, rs, imm      10   if rd == rs then pc <= imm
//   BNE  rd, rs, imm      11   if rd != rs then pc <= imm
//   HLT                   12   stop: pc holds and halt goes high
//
// Memory is external so its size is the designer's choice: pc addresses an
// instruction ROM (instr is the word it returns), and addr / dataOut / we /
// dataIn connect to a data RAM. Everything is combinational from the
// current instruction; the register file, RAM and pc update together on
// the rising edge. Assert reset for one edge to start at pc = 0 (registers
// are left undefined; a program should LDI what it needs).
class CPU extends Hardware {

  static WIDTH = 8

  static ops = {
    NOP: 0, LDI: 1, LD: 2, ST: 3, ADD: 4, SUB: 5, AND: 6, OR: 7,
    ADDI: 8, JMP: 9, BEQ: 10, BNE: 11, HLT: 12
  }

  constructor(reset, instr, dataIn, pc, addr, dataOut, we, halt, c) {
    const width = CPU.WIDTH
    if (reset.length != 1 || instr.length != 2 * width || dataIn.length != width || pc.length != width ||
        addr.length != width || dataOut.length != width || we.length != 1 || halt.length != 1) {
      throw new Error('Invalid Connection/s')
    }
    super([reset, instr, dataIn, [...pc, ...addr, ...dataOut, ...we, ...halt]], c)

    // instruction fields, LSB first
    const imm = instr.slice(0, width)
    const rs = instr.slice(width, width + 2)
    const rd = instr.slice(width + 2, width + 4)
    const op = instr.slice(width + 4, width + 8)

    const line = wires(16)        // one-hot decoded opcode
    const aluB = wires(width)     // rs or imm
    const result = wires(width)
    const flags = wires(2)        // [carry, zero]
    const notZero = wires(1)
    const notReset = wires(1)
    const useImm = line[CPU.ops.ADDI]
    const aluOp = wires(2)
    const wbSel = [line[CPU.ops.LD], line[CPU.ops.LDI]] // 00 alu, 01 mem, 1x imm
    const wb = wires(width)       // write-back value
    const anyWrite = wires(1)
    const regWrite = wires(1)
    const beq = wires(1)
    const bne = wires(1)
    const jump = wires(1)
    const pcLoad = wires(1)
    const pcEn = wires(1)
    this.internalWiring = [
      ...line, ...aluB, ...result, ...flags, ...notZero, ...notReset, ...aluOp, ...wb,
      ...anyWrite, ...regWrite, ...beq, ...bne, ...jump, ...pcLoad, ...pcEn
    ]
    const zero = flags[1]
    const l = line

    // decode
    this.components.push(new DecoderNxM(op, line))
    this.components.push(new NotGate(reset, notReset))
    this.orAll([l[5], l[7], l[10], l[11]], aluOp[0])       // SUB, OR, BEQ, BNE
    this.orAll([l[6], l[7]], aluOp[1])                     // AND, OR
    this.orAll([l[1], l[2], l[4], l[5], l[6], l[7], l[8]], anyWrite[0])
    this.components.push(new AndGate(anyWrite, notReset, regWrite))
    this.components.push(new AndGate([l[3]], notReset, we))
    this.components.push(new Buffer([l[12]], halt))

    // datapath: registers -> ALU -> write-back
    this.registers = new RegisterFile(rd, rs, rd, wb, regWrite, dataOut, addr, c)
    this.components.push(this.registers)
    this.components.push(new Mux2x1(addr, imm, [useImm], aluB))
    this.components.push(new ALU(dataOut, aluB, aluOp, result, flags))
    this.components.push(new Mux4x1(result, dataIn, imm, imm, wbSel, wb))

    // control flow
    this.components.push(new NotGate([zero], notZero))
    this.components.push(new AndGate([l[10]], [zero], beq))
    this.components.push(new AndGate([l[11]], notZero, bne))
    this.components.push(new OrGate([l[9]], beq, jump))
    this.components.push(new OrGate(jump, bne, pcLoad))
    this.components.push(new NotGate([l[12]], pcEn))
    this.components.push(new ProgramCounter(imm, pcLoad, pcEn, reset, pc, c))
  }

  // OR chain of single wires into out
  orAll(inputs, out) {
    let acc = inputs[0]
    for (let k = 1; k < inputs.length; k++) {
      const o = k == inputs.length - 1 ? out : wires(1)[0]
      if (o !== out) this.internalWiring.push(o)
      this.components.push(new OrGate([acc], [inputs[k]], [o]))
      acc = o
    }
  }

  // Encode one instruction as a 16-character binary string.
  static encode(op, rd = 0, rs = 0, imm = 0) {
    const code = typeof op == 'string' ? CPU.ops[op] : op
    if (code === undefined) throw new Error(`Unknown instruction ${op}`)
    if (imm < 0 || imm > 255 || rd < 0 || rd > 3 || rs < 0 || rs > 3) throw new Error(`Operand out of range in ${op}`)
    return (code << 12 | rd << 10 | rs << 8 | imm).toString(2).padStart(16, '0')
  }

  // Assemble a program into ROM contents. One instruction per line, ';'
  // starts a comment, 'name:' defines a label usable wherever an immediate
  // is expected. Registers are r0 .. r3; a memory operand is [rN].
  //
  //   loop: ADD r0, r1
  //         SUB r1, r3
  //         BNE r1, r2, loop
  static assemble(source) {
    const labels = {}
    const lines = []
    for (let text of source.split('\n')) {
      text = text.replace(/;.*/, '').trim()
      const label = text.match(/^(\w+):\s*(.*)$/)
      if (label) {
        labels[label[1]] = lines.length
        text = label[2]
      }
      if (text) lines.push(text)
    }
    const reg = (t) => {
      const m = t.match(/^\[?r([0-3])\]?$/)
      if (!m) throw new Error(`Expected a register, got '${t}'`)
      return Number(m[1])
    }
    const imm = (t) => {
      if (t in labels) return labels[t]
      if (!/^\d+$/.test(t)) throw new Error(`Expected a number or label, got '${t}'`)
      return Number(t)
    }
    return lines.map((text) => {
      const [op, ...args] = text.split(/[\s,]+/)
      const name = op.toUpperCase()
      switch (name) {
        case 'NOP': case 'HLT': return CPU.encode(name)
        case 'LDI': case 'ADDI': return CPU.encode(name, reg(args[0]), 0, imm(args[1]))
        case 'LD': case 'ST': case 'ADD': case 'SUB': case 'AND': case 'OR':
          return CPU.encode(name, reg(args[0]), reg(args[1]))
        case 'JMP': return CPU.encode(name, 0, 0, imm(args[0]))
        case 'BEQ': case 'BNE': return CPU.encode(name, reg(args[0]), reg(args[1]), imm(args[2]))
        default: throw new Error(`Unknown instruction '${op}'`)
      }
    })
  }

}

module.exports = { CPU }
