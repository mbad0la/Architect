![Architect](media/banner.png)

> Highly Extensible Hardware Description Library for JavaScript Developers

Hardware is event-driven. And it is functional in nature, having abstractions on abstractions.

Makes sense to have JavaScript emulate it doesn't it?

### Motivation

Hardware Description can be fun and very educational, but I had to learn [VHDL](https://en.wikipedia.org/wiki/VHDL) to be able to do so.

Hence, being a JavaScript Enthusiast, I decided to write this library down for JavaScript Developers who wanted to get into Hardware Description but were reluctant to learn a new language for it.

For people not acquainted with both VHDL and JS, I'm pretty sure the learning curve would be lesser for this library. Although I cannot state that my library is better as it is not easy to compete with a language intended for hardware description, nevertheless, I will keep on hacking this library to see how this experiment goes.

Let's get to business!

### Installation

`npm install architectjs`

### Existing Hardware Abstractions

* Gates
  * AndGate
  * TriInpAndGate
  * OrGate
  * XorGate
  * NotGate
  * NandGate
  * NorGate
  * XnorGate
* Decoders
  * Decoder1x2
  * Decoder2x4
* Arithmetics
  * HalfAdder
  * FullAdder
  * PipoAdder
* Flip-Flops
  * SRFlipFlop
  * DFlipFlop

### :electric_plug: Plug-n-Play

Use existing abstractions seemlessly.

Let's plug in an AND-Gate

```js
const { wires } = require('architectjs')('Connectors')
const { AndGate } = require('architectjs')('Gates')
const { StringIO } = require('architectjs')('IO')

// provision wires to connect to your hardware
const inputA = wires(1)
const inputB = wires(1)
const output = wires(1)
// initialise the hardware
const hWare = new AndGate(inputA, inputB, output)
// wrap hardware in a I/O BlackBox
// this is compulsory, to be able to do I/O using strings
const ioHandler = new StringIO(hWare)

console.log(ioHandler.input('1', '1')) // prints 1

console.log(ioHandler.input('0', '0')) // prints 0
```

Say what? `AND` is way too easy to be called an abstraction?

No worries, let's plug in this generalised Parallel-in-Parallel-out Adder!

```js
const { wires } = require('architectjs')('Connectors')
const { PipoAdder } = require('architectjs')('Arithmetics')
const { StringIO } = require('architectjs')('IO')

// code for 4-bit adder
const inputA = wires(4)
const inputB = wires(4)
const sum = wires(5)
const hWare = new PipoAdder(inputA, inputB, sum)
const ioHandler = new StringIO(hWare)
console.log(ioHandler.input('1111', '1111')) // prints 11110
```

Or maybe we want to build something from existing abstractions?

#### Abstraction Rules and Specs

* Every Class/hardware extends on `Hardware`.
* Every initialisation argument to the class instance has to be an array of `Wire` instances (obtained from the `wires` method).
* An array consisting of I/O `wires` is passed onto the parent class `Hardware`, with only the last element being the output parameter. It is necessary to provide every input parameter and the output parameter to be able to wrap this in a `StringIO` instance to do I/O operations with `string` arguments.
* Every class instance has two instance variables available from the parent `Hardware` instance :
  * internalWiring - Array of `Wire` instances (initially empty).
  * components - Array of abstractions used to build your hardware (initially empty).
* Your entire logic goes into your Class' constructor.
* `internalWiring` variable is used to initialise `Wire` instances that are not a part of the I/O for the hardware but are required to inter-connect the sub-components in your abstraction.
* `components` variable is used to store instances of subcomponents used in your hardware. This helps a designer to quickly refer to all the build blocks that went into making a particular piece of hardware.


Let's build a 4-input AND Gate using the above rules and specifications.

```js
const { wires } = require('architectjs')('Connectors')
const { AndGate } = require('architectjs')('Gates')
const { StringIO } = require('architectjs')('IO')
const { Hardware } = require('architectjs')('Base')

class FourInpAndGate extends Hardware {

  constructor(a, b, c, d, o) {
    super([a, b, c, d, o])
    this.internalWiring = wires(2) // declare wires to be used internally
    this.components.push(new AndGate(a, b, this.internalWiring[0]))
    this.components.push(new AndGate(c, d, this.internalWiring[1]))
    this.components.push(new AndGate(this.internalWiring[0], this.internalWiring[1], o))
  }

}

const a = wires(1)
const b = wires(1)
const c = wires(1)
const d = wires(1)
const o = wires(1)

const fourInpAnd = new FourInpAndGate(a, b, c, d, o)
const ioHandler = new StringIO(fourInpAnd)

console.log(ioHandler('0', '1', '1', '1')) // prints 0

console.log(ioHandler('1', '1', '1', '1')) // prints 1
```

### Creating a Declarative Hardware Component

#### Some Basic Rules

* Every Class/hardware extends on `Hardware`.
* All the logic goes inside the `hardware` method of your component's Class.
* Event to be listened for must be `signal`.

#### Let's get started

Every `Wire` instance extends on `EventEmitter`, thus this library essentially works by registering listeners in a Class instance and binding them to the `hardware` method of the Class.

With the help of `getSignal` and `propagateSignal` methods of `Wire`, read changes from input `Wire` instances, use your logic on them, and emit result through the output `Wire` instance.

Let's set this up with an example taken from this library

```js
const { Hardware } = require('architectjs')('Base')

class AndGate extends Hardware {

  constructor(x, y, o) {
    if (x.length != 1 || y.length != 1 || o.length != 1) throw new Error('Invalid Connection/s')
    super([x, y, o])
    this.x = x
    this.y = y
    this.o = o
    this.hardware = this.hardware.bind(this)
    x[0].on('signal', this.hardware)
    y[0].on('signal', this.hardware)
  }

  hardware() {
    let xSig = this.x[0].getSignal()
    let ySig = this.y[0].getSignal()
    if (xSig === 0 || ySig === 0) {
      this.o[0].propagateSignal(0)
    } else if (xSig === undefined || ySig === undefined) {
      this.o[0].propagateSignal(undefined)
    } else this.o[0].propagateSignal(xSig && ySig)
  }

}
```
### Development

There are just so many possibilities to do here! Would love to get contributions from the community :smile:
