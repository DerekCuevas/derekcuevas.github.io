---
title: "Exploring Advanced Types in TypeScript: Mapped & Conditional Types"
date: 2023-07-03T06:02:36.642Z
tags: ["typescript","advanced programming","types"]
authors: ["gpt-3.5-turbo-0301"]
---


TypeScript is a powerful statically-typed superset of JavaScript, offering a wealth of different types for developers to express their application's model. This post will explore the possibilities of advanced types in TypeScript, focusing on two specific types: mapped types and conditional types. 

## Mapped Types

Mapped types allow for the creation of new types based on the transformation of existing ones. Through template literals and keyof, a new type is created from an existing one by transforming each key or value.

Here's an example based on the `Readonly` type:

```typescript
type Person = {
  name: string;
  age: number;
};

type ReadOnly<T> = {
  readonly [P in keyof T]: T[P];
};

const person: Person = {
  name: 'John Doe',
  age: 30,
};

const readOnlyPerson: ReadOnly<Person> = {
  name: 'John Doe',
  age: 30,
};
```

In the above example, we defined a `Person` type which has two fields: name and age. We then defined a `ReadOnly` type which leverages a mapped type to create a new `readonly` version of the original type `T`. In this case, we transformed each key type in `T` into the same readonly version. 
Finally, we initialized a `Person` object and a `ReadOnly` version of it, where we can see that the `readOnlyPerson` properties are read-only.

Mapped types can also transform field types:

```typescript
type Mapped<T> = {
  [P in keyof T]: string;
};

const mappedPerson: Mapped<Person> = {
  name: 'John Doe',
  age: '30', // note that `age` is now a string
};
```

In this case, a `Mapped` type is defined to create a version of the original type `T` where each property value is now a string. 

## Conditional Types

Conditional types are used to conditionally choose between two alternative types, based on the evaluation of a type relationship at compile-time.

```typescript
type NonNull<T> = T extends null | undefined ? never : T;

type MyType = NonNull<string | null | undefined>; // "string"
```

In this example, we defined a generic `NonNull` type that checks whether the given type `T` extends `null` or `undefined`, and if it does, returns `never`, otherwise, the type `T` itself. We then tested this type on the type `string | null | undefined` to see that the result is narrowed to `string`. 

Here's another example using a more complex type:

```typescript
interface Item {
  id: string;
  name: string;
}

interface SubItem extends Item {
  parentId: string;
}

type GetParentId<T> = T extends { parentId: infer U } ? U : never;

const parentItem: Item = { id: '1', name: 'Parent' };
const subItem: SubItem = { id: '2', name: 'Child', parentId: '1' };

type ParentId = GetParentId<typeof subItem>; // "string"
```

In this example, we defined two interfaces [`Item`](#interface-item) and [`SubItem`](#interface-subitem). We then created a `GetParentId` type that extracts the type of the property `parentId` if it exists, otherwise, returns `never`.

Finally, we tested the `GetParentId` type on a `subItem` object, where we can see that the result is narrowed down to a `string` type, since `parentId` exists in `SubItem` but not in `Item`.

## Conclusion

Advanced types can help developers write more maintainable and robust TypeScript code. Mapped and conditional types are two powerful tools in TypeScript's type arsenal. By leveraging these language features, developers can write more expressive types that capture a wider range of behaviors with more clarity.