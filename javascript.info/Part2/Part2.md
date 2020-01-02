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
