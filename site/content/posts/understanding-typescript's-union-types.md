---
title: "Understanding TypeScript's Union Types"
date: 2023-07-06T18:02:02.845Z
tags: ["typescript","programming","types"]
authors: ["gpt-3.5-turbo-0301"]
---

## Introduction
TypeScript offers several data types to simplify the task of type checking during development. One such type is the union type, which denotes a value that can be one of several types. Union types are useful when a variable can contain more than one type of data. In this article, we'll discuss TypeScript's union type and how it can be used to simplify the codebase and improve type safety.

### Syntax
The syntax for declaring a union type in TypeScript is straightforward. We use the "|" operator to provide a list of types that a variable can hold. Here's an example:

```
let myVariable: string | number;
```

This code declares a variable named `myVariable` that can hold either a string or a number. Keep in mind that the vertical bar "|" in the code above is not an OR operator. Rather, it's a syntax element used to create union types.

## Creating Union Types
To create a union type, you must list the participating data types separated by the vertical bar symbol "|". 

### Example
Here's an example:

```
let value: string | number;
 
value = "Hello World"; // OK
value = 123; // OK
value = true; // Compilation Error: Type 'boolean' is not assignable to type 'string | number'.
```

In this example we define a variable `value` that can hold a string or a number, but not a boolean. If we try to assign a boolean value to it, we get a compilation error.

## Using Union Types
Union types are useful in situations where the exact data type of a variable is unknown. For example, in a function that can receive a string, a number or an array of strings, we can use a union type to declare the parameter type:

```
function printData(data: string | number | string[]) {
  console.log(data);
}
 
printData("Hello"); // prints "Hello"
printData(123); // prints "123"
printData(["apple", "banana", "cherry"]); // prints ["apple", "banana", "cherry"]
```

In the code above, we define a function named `printData()` that accepts a parameter named `data`. The `data` parameter can be of type string, number, or an array of strings. The function logs the received data to the console.

## Type Narrowing
TypeScript's type system allows us to narrow down the type of a union type variable, using type guards such as `typeof`. Let's explore an example:

```
let someVariable: string | number;
 
if (typeof someVariable === "string") {
    someVariable.toUpperCase();
} else {
    someVariable.toFixed(2);
}
```

In the code above, we declare a variable `someVariable` that can hold either a string or a number. We then use an `if` statement to narrow down the type of `someVariable`. If the variable holds a string, the `if` statement executes the `toUpperCase()` method. If `someVariable` holds a number, the `else` clause executes the `toFixed()` method.

## Conclusion
In this article, we discussed TypeScript's union type and how it can be used to improve type safety. We covered the syntax for declaring a union type, creating union types, using union types, and narrowing down the type of a union type variable. Union types provide a simple yet powerful way of expressing types that could have multiple values. Understanding how to use union types can lead to less code and fewer errors in your projects.