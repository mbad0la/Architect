![Architect](media/banner.png)

> Highly Extensible Hardware Description Library for JavaScript Developers

Hardware is event-driven. And it is functional in nature, having abstractions on abstractions.

Makes sense to have JavaScript emulate it doesn't it?

### Motivation

Hardware Description can be fun and very educational, but I had to learn [VHDL](https://en.wikipedia.org/wiki/VHDL) to be able to do so.

Hence, being a JavaScript Enthusiast, I decided to write this library down for JavaScript Developers who wanted to get into Hardware Description but were reluctant to learn a new language for it.

For people not acquainted with both VHDL and JS, I'm pretty sure the learning curve would be lesser for this library. Although I cannot state that my library is better as it is not easy to compete with a language intended for hardware description, nevertheless, I will keep on hacking this library to see how this experiment goes.

Let's get to business!

### :electric_plug: Plug-n-Play

Use existing abstractions seemlessly.

Let's plug in an AND-Gate

```js
// provision wires to connect to your hardware
let a = wires(1)
let b = wires(1)
let output = wires(1)
// initialise the hardware
let myAndGate = new AndGate(a, b, output)
// wrap hardware in a I/O BlackBox
let ioHandler = new StringIO(myAndGate)

console.log(ioHandler.input('1', '1')) // prints 1

console.log(ioHandler.input('0', '0')) // prints 0
```

Or maybe we need a four input AND-Gate. Let's build it from existing abstractions

```js
class FourInpAndGate() {

  constructor(a, b, c, d, o) {
    super(a,b,c,d,o)
    this.internalWiring = wires(2) // declare wires to be used internally
    this.components.push(new AndGate(a, b, this.internalWiring[0]))
    this.components.push(new AndGate(c, d, this.internalWiring[1]))
    this.components.push(new AndGate(this.internalWiring[0], this.internalWiring[1], o))
  }

}

let a = wires(1)
let b = wires(1)
let c = wires(1)
let d = wires(1)
let o = wires(1)

let fourInpAnd = new FourInpAndGate(a, b, c, d, o)
let ioHandler = new StringIO(fourInpAnd)

console.log(ioHandler('0', '1', '1', '1')) // prints 0

console.log(ioHandler('1', '1', '1', '1')) // prints 1
```

### Development

There are just so many possibilities to do here! Would love to get contributions from the community :smile:

### Info

I'll be taking a while to document this properly. Please bear with me or play around with my code to figure it out yourself :smirk:
