All applications work with data. We need to store this data somewhere, for example, eCommerce application has data regarding products, users, cart, etc. Variables are used to store this information. Let us study variables in detail.


## JavaScript Variables

According to [w3schools](https://www.w3schools.com/js/js_variables.asp) variables are containers for storing data. We can imagine them as a container with a label on it and in the container, we can store numbers, strings, objects, and other data.

> In the new standard these are declared with a `let` keyword. Earlier they used to define with the `var` keyword. We will study the `var` keyword on another day. 

The following statement declared a variable with a name `product`.

```javascript
    let product;
```
Now to store some value into our variable 

```javascript
   let product;
   product = 'watch';

   // abbreviation
   let product = 'watch';
```
Now, the product variable has the value 'watch' stored in it. We can access it using its name ie product. Like when we will do `alert(product);` after declaring the variable the output will be an alert box with watch written on it.

We can also declare multiple variables in a statement for example:

```javascript
    var person = "John Doe", carName = "Volvo", price = 200;
```

We can also declare them in multiple lines:

```javascript
    var person = "John Doe",
        carName = "Volvo", 
        price = 200;
```

Declaring multiple variables in a single line is generally not preferred because it reduces the readability of the code. So, as a rule of thumb, we either declare variables every time with a `let` keyword in front or if we want to declare multiple variables in a single statement we do it multiline.


## The Assignment Operator

In javascript `=` is an assignment operator, not an equals operator. Means whenever we use `=` we assign a variable value not check if it is equal to another thing. Using this assignment operator we can reassign a value of a variable for example

```javascript
    let product = 'clothes';
    product = 'shoes';
    
    alert(product); // Gives popup with shoes written on it
``` 
In the above example, the value of product has been reassigned to 'shoes'.


## Defining constants

Using `let` we can declare variables that can change but what if we want to declare variables that remain constant. For that, we can use the `const` keyword. Variables declared using `const` have a constant value and will throw an error if we try to reassign it.

```javascript
    const bestseller = 'watch';
    bestseller = 'clothes'; // will throw an error
```
It is used to define constants like distance between sun and moon etc.


## Javascript Identifiers

All variables should be defined with a name these names are called javascript identifiers but naming variables has some rules.

The general rules for names for variables from [W3schools](https://www.w3schools.com/js/js_variables.asp) are:

1. Names can contain letters, digits, underscores, and dollar signs.
1. Names must begin with a letter
1. Names can also begin with $ and _ (but we will not use here)
1. Names are case sensitive (y and Y are different variables)
1. Reserved words (like JavaScript keywords) cannot be used as names


## Naming right

We should be very careful while naming our variables, our variables should convey what we are trying to achieve by storing that information in a variable. What info does this variable contain? We often keep editing old code so if the variables are named well than editing code gets very easy which saves a lot of man-hours. So, naming variables right has real economic value.

Programmers struggle while naming variables. Here are a few suggestions from [javascript.info](https://javascript.info/variables#name-things-right) that may help us in this.

1. Use human-readable names like userName or shoppingCart.
1. Stay away from abbreviations or short names like a, b, c, unless we really know what we’re doing.
1. Make names maximally descriptive and concise. Examples of bad names are data and value. Such names say nothing. It’s only okay to use them if the context of the code makes it exceptionally obvious which data or value the variable is referencing.
1. Agree on terms within our team and in our own minds. If a site visitor is called a “user” then we should name related variables currentUser or newUser instead of currentVisitor or newManInTown.
