# potential-fortnight
Top secret game, feel free to contribute.

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
