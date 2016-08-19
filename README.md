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

// prints 1
console.log(ioHandler.input('1', '1'))
// prints 0
console.log(ioHandler.input('0', '0'))
```
