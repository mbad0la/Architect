# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project
uses [Semantic Versioning](https://semver.org/) (0.x: minor bumps may break).

## [0.5.0] - 2026-09-19

### Added
- `CPU`: single-cycle 8-bit CPU with four registers and 13 instructions (`LDI`, `LD`,
  `ST`, `ADD`, `SUB`, `AND`, `OR`, `ADDI`, `JMP`, `BEQ`, `BNE`, `HLT`, `NOP`). Memories
  are external: `pc` drives a `ROM`, `addr` / `dataOut` / `we` / `dataIn` drive a `RAM`.
  `CPU.assemble(source)` turns assembly text (with labels and comments) into ROM
  contents; `CPU.encode` builds one word.
- `ROM`: 2^N words programmed at construction from binary strings or numbers.
- `RegisterFile`: 2^N registers with two asynchronous read ports and one synchronous
  write port.
- `ProgramCounter`: reset / load / enable with that priority.
- `MuxNx1`: 2^N-to-1 multiplexer over W-bit buses.
- `Incrementer`: `o = a + 1` mod 2^N.
- `Buffer` gate and `constant(sig)` wires (Vcc / Gnd) in `Connectors`.
- `Register` takes an optional load-enable wire as a fourth argument.
- `Hardware.gateCount()`.
- `RAM.words` and `RegisterFile.registers` expose the stored buses for inspection.

### Changed
- `RAM` is built from enable-registers and `MuxNx1` instead of a per-word `Mux2x1`
  and an inline read tree (same behaviour, fewer gates).
- `Counter` is built on `Incrementer`.

## [0.4.0] - 2026-09-19

### Added
- `DecoderNxM`: N-bit LSB-first address bus to 2^N one-hot lines, with an optional
  enable wire that forces every line low.
- `RAM`: 2^N words of W bits in `Sequential/memory.js`. Asynchronous read (`dout`
  follows `addr`), synchronous write (`din` stored at `addr` on a rising edge with
  `we` high). Built from `DecoderNxM`, `Mux2x1` and `Register`.

## [0.3.0] - 2026-09-19

### Added
- Edge-triggered `SRFlipFlop` and `DFlipFlop` (master-slave, rising edge).
- `SRLatch` and `DLatch`: the level-sensitive latches the flip-flops are built from.
- `Register`, `ShiftRegister` and `Counter` (synchronous up counter with synchronous reset).
- `PipoSubtractor` (two's complement); `PipoAdder` accepts an optional carry-in wire.
- `Mux2x1`, `Mux4x1`, `Demux1x2` over N-bit buses.
- `Encoder4x2`.
- `Comparator`: N-bit unsigned, outputs `[lt, eq, gt]`.
- `ALU`: N-bit ADD / SUB / AND / OR selected by a 2-bit `op`, with `[carry, zero]` flags.
- `BitwiseAnd`, `BitwiseOr`, `BitwiseXor`, `BitwiseNot` over N-bit buses.
- `Hardware` takes an optional second argument `clock`, exposed as `this.clock`.
- `StringIO.input()` validates the argument count and each string's width.
- `CHANGELOG.md` and a GitHub Actions workflow running the test suite.

### Changed
- **Breaking:** `SRFlipFlop` and `DFlipFlop` were level-sensitive latches and are now
  rising-edge triggered. Use `SRLatch` / `DLatch` for the old behaviour.
- **Breaking:** buses are LSB-first everywhere: `wire[0]` is bit 0 on inputs, outputs
  and internal wiring. `StringIO` prints outputs MSB-first, so strings are unchanged
  for adders, but adder output wires are reordered (`s[0]` is the LSB, the carry is
  the top wire) and `Decoder2x4` prints line 0 on the right (`'0001'` for input `0,0`).
- `StringIO.input()` supports inputs of different widths (it previously assumed every
  input was as wide as the first).
- `Wire` no longer triggers Node's `MaxListenersExceededWarning` on high fan-out nets.

### Fixed
- Gates evaluate on construction, so a component attached to wires that already carry a
  signal produces its output without waiting for the next change.
- README `FourInpAndGate` example passed bare wires instead of wire arrays.

## [0.2.0] - 2026-09-18

### Added
- Delta-cycle `Simulator`: writes are scheduled and applied in rounds, so results no
  longer depend on component construction order and feedback circuits settle
  deterministically. Unstable circuits throw `Circuit did not settle` instead of
  overflowing the stack.
- `Clock` wire with a synchronous `tick()` for deterministic clocked tests.
- `wires(n, name)` accepts an optional name for diagnostics.
- `Decoders` exported from `index.js` (previously implemented but unreachable).

### Changed
- **Breaking:** `propagateSignal` no longer applies a value immediately. Code that
  writes wires directly and reads them back must call `simulator.run()` first
  (`StringIO.input()` and `Clock.tick()` do this for you).
- AVA upgraded to v8; Node >= 22.20 required.

## [0.1.x]

Initial releases: gates, decoders, adders, SR/D flip-flops, `StringIO`.
