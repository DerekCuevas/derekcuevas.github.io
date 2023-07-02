---
title: "Advanced TypeScript types: Conditional Types"
date: 2023-05-29T02:29:18.029Z
tags: ["typescript","type system","advanced types"]
authors: ["gpt-3.5-turbo-0301"]
---


TypeScript is a statically typed language that allows developers to write more secure and reliable code. It comes with a powerful type system that allows you to create custom types, which can be used to catch bugs at compile time and improve code quality. Conditional types are a powerful feature in the TypeScript type system that allow you to create types that depend on other types. In this post, we’ll explore the basics of conditional types and how to use them in your TypeScript code.

## What are conditional types?

Conditional types in TypeScript are types that depend on other types. You can use them to create new types by applying conditions to existing types. In other words, you can create a type that depends on a certain value or property of another type. This can be particularly useful when writing generic code that needs to work with different types.

## Basic Syntax

The basic syntax for a conditional type in TypeScript is as follows:

```ts
type TypeName<T> = T extends SomeType ? TrueType : FalseType;
```

In this example, `TypeName` is the name of the new type being defined, `T` is a generic type parameter, and `SomeType` is an existing type. If `T` is assignable to `SomeType`, then the resulting type is `TrueType`. Otherwise, the resulting type is `FalseType`.

Here’s an example that uses a conditional type to create a new type based on the type of a given value:

```ts
type StringOrNumber<T> = T extends string ? string : number;

const value: StringOrNumber<"hello"> = "hello"; // value is inferred as type string
const value2: StringOrNumber<42> = 42; // value2 is inferred as type number 
```

In this example, the `StringOrNumber` type depends on whether `T` is a string or a number. If `T` is a string, then the resulting type is `string`. Otherwise, the resulting type is `number`. 

## Advanced usage

Conditional types can be combined with other advanced TypeScript features like `infer` to create even more powerful types. `infer` is a keyword that allows you to infer the type of a generic parameter from another type. 

Here’s an example of a generic type that uses `infer` to extract the type of a promise’s resolved value:

```ts
type UnpackPromise<T> = T extends Promise<infer U> ? U : T;

const promise = Promise.resolve("hello");
type PromiseResult = UnpackPromise<typeof promise>; // PromiseResult is inferred as type string
```

In this example, the `UnpackPromise` type takes a generic type `T`. If `T` is assignable to `Promise<infer U>`, then the resulting type is `U` (the type of the resolved value of the promise). Otherwise, the resulting type is `T`.

## Conclusion

Conditional types are a powerful feature of the TypeScript type system that allow you to create types that depend on other types. They can be used to make your code more generic and reusable, while also making it more secure and reliable. By combining conditional types with other advanced TypeScript features like `infer`, you can create even more powerful types that can catch bugs at compile time and improve code quality.