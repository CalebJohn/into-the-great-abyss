# potential-fortnight

[![Build Status](https://travis-ci.org/CalebJohn/potential-fortnight.svg?branch=master)](https://travis-ci.org/CalebJohn/potential-fortnight)

A prototype for a space exploration/management game.

![sketch](https://cloud.githubusercontent.com/assets/2179547/13969920/241d406a-f04b-11e5-95a2-b51d8bcd1df9.png)

Style Guide
-----------
This project will defer to [idiomatic.js](https://github.com/rwaldron/idiomatic.js/), with some elaborations and exceptions below.

* Use 2 space indentation, no tabs
* Always use spacing between operators (i.e. `2 + 2` not `2+2`)
* Don't use additional whitespace inside parens (i.e. `(2 + 2)` not `( 2 + 2 )`)
* Braces should stay on the same line for conditionals and else clauses should share a line with closing braces i.e.
    ```javascript
    
    if (flag) {
      // Do something
    } else {
      // Do something else
    }
    ```
* Variables with definitions should all get their own var i.e.
    ```javascript
    
    var x = 0;
    var y = 0; // Good
    // or
    var i, j; // Good
    // As opposed to
    var x = 0, y = 0; // Bad
    ```
* Single quotes will be used for all strings
* Try to stick with `===` as opposed to `==` whenever possible
* Along with the previous point, avoid automatic type coercion tricks such as `var b = +"1"; // b = 1`

It is recommended that you read through [idiomatic.js](https://github.com/rwaldron/idiomatic.js/) to get a sense of Javascript style before contributing.

Contributing
-----------
This branch is using [godotengine](https://godotengine.org) rather than the Phaser web framework. 

In order to contribute download the godot executable and run it from the parent directory of potential-fortnight. 
