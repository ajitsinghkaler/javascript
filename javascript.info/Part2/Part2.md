# Javascript Fundaments

## Intro

If src is set, the `<script>` content is ignored.

## Code Structure

JavaScript does not assume a semicolon before square brackets `[...]`.

## Use Strict

- "use strict" can be put at the beginning of the function body instead of the whole script. Doing that enables strict mode in that function only. But usually, people use it for the whole script.
- Please make sure that "use strict" is at the top of your scripts, otherwise strict mode may not be enabled.
- Only comments may appear above "use strict".

## Type conversions

Numeric conversion rules:
undefined NaN
null 0
true and false 1 and 0
string Whitespaces from the start and end are removed. If the remaining string is empty, the result is 0. Otherwise, the number is “read” from the string. An error gives NaN.

## Opertors

- = returns a value
- Comma
The comma operator , is one of the rarest and most unusual operators. Sometimes, it’s used to write shorter code, so we need to know it in order to understand what’s going on.

The comma operator allows us to evaluate several expressions, dividing them with a comma ,. Each of them is evaluated but only the result of the last one is returned

## Comparisons

- String comparison
To see whether a string is greater than another, JavaScript uses the so-called “dictionary” or “lexicographical” order.

- In other words, strings are compared letter-by-letter

- null === undefined  `false`

- null == undefined  `true`

- null > 0 false
 null == 0 false
 null >= 0 true
Mathematically, that’s strange. The last result states that "null is greater than or equal to zero", so in one of the comparisons above it must be true, but they are both false.

The reason is that an equality check == and comparisons > < >= <= work differently. Comparisons convert null to a number, treating it as 0. That’s why (3) null >= 0 is true and (1) null > 0 is false.

On the other hand, the equality check == for undefined and null is defined such that, without any conversions, they equal each other and don’t equal anything else. That’s why (2) null == 0 is false.

## Logical operators

- The OR || operator does the following:

Evaluates operands from left to right.
For each operand, converts it to boolean. If the result is true, stops and returns the original value of that operand.
If all operands have been evaluated (i.e. all were false), returns the last operand

### Usage

1. Getting the first truthy value from a list of variables or expressions.
2. Short Circuit Evaluation can be used as an if.

- The AND && operator does the following:

Evaluates operands from left to right.
For each operand, converts it to a boolean. If the result is false, stops and returns the original value of that operand.
If all operands have been evaluated (i.e. all were truthy), returns the last operand.

Precedence of AND && is higher than OR ||

- A double NOT !! is sometimes used for converting a value to boolean type.

## Loops

- No break/continue to the right side of ‘?’
Please note that syntax constructs that are not expressions cannot be used with the ternary operator ?. In particular, directives such as break/continue aren’t allowed there.

A label is an identifier with a colon before a loop:
The break `<labelName>` statement in the loop below breaks out to the label

 A label is the only way for break/continue to escape a nested loop to go to an outer one.

## Switch statement

Equality check is always strict

## Functions

Evaluation of default parameters
In JavaScript, a default parameter is evaluated every time the function is called without the respective parameter.

function showMessage(from, text = anotherFunction()) {}

In anotherFunction() is called every time showMessage() is called without the text parameter.

## Callbacks

The arguments showOk and showCancel of ask are called callback functions or just callbacks.

The idea is that we pass a function and expect it to be “called back” later if necessary.

Difference in function declarion and function expressions
Function declaration we can use function before it is intrepreted
Funtion can only be caaled after intrepreter reads it.

In strict mode, when a Function Declaration is within a code block, it’s visible everywhere inside that block. But not outside of it.

## Variable Naming

A variable name can include:

Letters and digits, but the first character may not be a digit.
Characters $ and _ are normal, on par with letters.
Non-Latin alphabets and hieroglyphs are also allowed, but commonly not used.
