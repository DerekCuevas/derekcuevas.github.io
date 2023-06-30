---
title: "Mastering TypeScript's Record Type"
date: 2023-06-30T18:02:17.196Z
tags: ["typescript","programming"]
---



TypeScript is a powerful superset of JavaScript that provides additional features including strong typing. With its enhanced type system, TypeScript offers data structures that have no direct counterparts in JavaScript. One of these features is the `Record` type, which allows you to create an object with key-value pairs where you know the keys in advance.

In this post, we will dive into TypeScript's `Record` type and see how it can be used in your projects.

## The `Record` Type

The `Record` type is a built-in utility type in TypeScript that makes it easy to create an object type with key-value pairs where you know the keys in advance. It is defined in the TypeScript standard library as:

```typescript
type Record<K extends keyof any, T> = {
  [P in K]: T;
};
```

This type takes two type parameters:

1. `K`: the union of keys for the resulting object type
2. `T`: the type of the values associated with each key

Here's an example that shows how to use the `Record` type to create an object type with key-value pairs:

```typescript
type Point = { x: number, y: number };
type PointsMap = Record<string, Point>;

const points: PointsMap = {
  'A': { x: 0, y: 0 },
  'B': { x: 1, y: 1 },
  'C': { x: 2, y: 0 },
};
```

In this example, we create a type `Point` that represents an `{ x, y }`-pair and a `PointsMap` type that maps strings to `Point`s. We then use `Record<string, Point>` to create an object type with key-value pairs where the keys are strings and the values are of type `Point`.

## Type Safety with `Record`

One of the benefits of using the `Record` type is that it provides type safety for key-value pairs. Consider this example:

```typescript
type PointsMap = Record<string, Point>;

const points: PointsMap = {
  'A': { x: 0, y: 0 },
  'B': { x: 1, y: 1 },
  'C': { x: '2', y: 0 },
};
```

In this example, we create a `PointsMap` object where the `x` value for the `C` key is a string instead of a number. If we try to compile this code, TypeScript will give us an error:

```
Type 'string' is not assignable to type 'number'.
```

This error highlights the benefit of using the `Record` type: you get type safety for all the key-value pairs in the object.

## Mapped Types

The `Record` type is just one example of a mapped type in TypeScript. Mapped types are a way to transform an existing type into another type. The transformation is defined by a mapping function that applies to each property in the original type.

Here's an example of a simple mapped type that adds the `readonly` modifier to each property in an existing object type:

```typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};
```

In this example, `keyof T` is the union of keys for the original object type `T`. The `in` keyword creates a mapped type by iterating through each key in `keyof T` and applying the mapping function.

Here's an example of how to use the `Readonly` type to create a readonly version of an existing object type:

```typescript
type Person = {
  name: string;
  age: number;
};
type ReadonlyPerson = Readonly<Person>;

const person: ReadonlyPerson = {
  name: 'Alice',
  age: 30,
};
person.name = 'Bob'; // Error: Cannot assign to 'name' because it is a read-only property.
```

In this example, we create a `Person` type that has `name` and `age` properties. We then use the `Readonly` type to create a readonly version of `Person` called `ReadonlyPerson`. When we try to modify the `name` property of an object with type `ReadonlyPerson`, TypeScript flags an error indicating that the property is readonly.

## Conclusion

The `Record` type is a powerful feature in TypeScript that allows you to easily define object types with key-value pairs where you know the keys in advance. It provides type safety for key-value pairs, which can help prevent bugs in your code. Additionally, the `Record` type is just one example of a mapped type in TypeScript that can be used to transform existing types.