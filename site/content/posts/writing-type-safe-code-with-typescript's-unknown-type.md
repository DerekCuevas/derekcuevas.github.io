---
title: "Writing Type-Safe Code with TypeScript's unknown Type"
date: 2023-07-05T06:02:20.452Z
tags: ["typescript","type safety","error handling"]
authors: ["gpt-3.5-turbo-0301"]
---


TypeScript has become a popular choice for writing JavaScript applications, thanks in part to its ability to provide type-safety to your code. However, there are times when the type of a variable cannot be determined at compile-time. This can happen when receiving data from an API endpoint, parsing data from an external file, or dealing with data of unknown type. In these cases, it can be difficult to ensure that your code is still type-safe and errors are caught early on. In this article, we'll explore how to use TypeScript's "unknown" type to write type-safe code that can handle unknown data.

## Understanding the "unknown" Type

In TypeScript, the "unknown" type represents values that can be of any type. It is similar to the "any" type in that it can be assigned to any other type, but with one important difference: the "unknown" type forces you to perform a type check before using the value.

For example, consider the following code snippet:

```typescript
function parseJSON(json: string): unknown {
  return JSON.parse(json);
}

const data = parseJSON('{ "name": "John", "age": 30 }');

console.log(data.name); // Error: Property 'name' does not exist on type 'unknown'.
```

Here, we have defined a function that parses a JSON string and returns the parsed value. Since we don't know the type of the data being parsed, we have returned an "unknown" type. When we try to access the "name" property of the parsed object, we get a compile-time error because TypeScript doesn't know the type of "data".

To fix this error, we need to perform a type-check. We can do this using a type-guard function. A type-guard function is a function that checks whether a value is of a certain type, and then returns a boolean value indicating whether the check succeeded. Here's an example:

```typescript
function isPerson(obj: any): obj is Person {
  return typeof obj === 'object' && obj !== null && 'name' in obj && 'age' in obj;
}

interface Person {
  name: string;
  age: number;
}

function parseJSON(json: string): unknown {
  return JSON.parse(json);
}

const data = parseJSON('{ "name": "John", "age": 30 }');

if (isPerson(data)) {
  console.log(data.name); // "John"
} else {
  console.log("Invalid data format");
}
```

In this code, we have defined an interface for a "Person" object, and a type-guard function that checks whether an object satisfies this interface. We then use this type-guard function to check whether the parsed data is a "Person" object before accessing its "name" property.

## Using "unknown" with Generic Functions

TypeScript's "unknown" type is also useful when defining generic functions that can take any type of value. We can use "unknown" as a placeholder for unknown types, and then perform a type-check in the function to ensure that the input value is of the correct type.

For example, consider the following generic function that calculates the length of an array:

```typescript
function arrayLength<T>(array: T[]): number {
  return array.length;
}
```

This function assumes that the input value is an array, but it doesn't explicitly enforce this assumption. To make this function more type-safe, we can use the "unknown" type as a placeholder for the input values:

```typescript
function arrayLength(array: unknown): number {
  if (Array.isArray(array)) {
    return array.length;
  } else {
    throw new Error("Invalid input: not an array");
  }
}
```

Here, we have defined a function that takes an "unknown" value and checks whether it is an array. If it is, we return its length; if not, we throw an error. This ensures that the function is type-safe and protects against runtime errors caused by passing the wrong type of input.

## Conclusion

TypeScript's "unknown" type provides a powerful tool for writing type-safe code that can handle unknown data. By performing type-checks using type-guard functions or conditional statements, you can ensure that your code is protected against runtime errors caused by incorrect types. If you're writing code that deals with data of unknown type, be sure to make use of TypeScript's "unknown" type to keep your code type-safe and avoid errors.