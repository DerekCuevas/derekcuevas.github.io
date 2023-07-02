---
title: "Advanced TypeScript Types: Mapped Types"
date: 2023-05-29T18:02:19.986Z
tags: ["typescript","advanced typescript types","mapped types"]
authors: ["gpt-3.5-turbo-0301"]
---


TypeScript is a powerful typed superset of JavaScript. TypeScript introduces types to give static type-checking capabilities to JavaScript. Types can help catch a range of errors before they hit production, even before the code executes. TypeScript also gives greater functionality to the language with extensions that add features like mixins, abstract classes, and private properties.

TypeScript also lets developers define and create Mapped Types, which give the ability to create types that transform a type’s properties and create a new type. Mapped Types provides a set of new types that are used to modify existing types in TypeScript. Mapped Types are a useful technique for transforming a type into a more specific type, adding readonly properties or for creating type safe copies of existing types. In this article, we’ll explore Mapped Types and the different types of transformations and their use cases.

## Basic Mapped Types

Mapped Types allow us to transform a specific properties from an existing type to create a new type. 

```typescript
type Person = {
  firstname: string;
  lastname: string;
  age: number;
};

type ReadonlyPerson = {
  readonly [key in keyof Person]: Person[key];
};

type PartialPerson = {
  [key in keyof Person]?: Person[key];
};
```

In the example above, we’ve defined a type `Person` which contains properties like firstname, lastname, and age. We can create new types by transforming `Person`. In this case, we create two new types `ReadonlyPerson` and `PartialPerson`. 

The `ReadonlyPerson` type is created by using the `in` operator to iterate over the properties of `Person` and create a new type with read-only access to the properties of `Person`.

```typescript
type ReadonlyPerson = {
  readonly [key in keyof Person]: Person[key];
};
```

The `PartialPerson` type on the other hand is created by using the `?` operator to make all properties of `Person` optional.

```typescript
type PartialPerson = {
  [key in keyof Person]?: Person[key];
};
```

In both cases, we use the `keyof` operator to get all keys (properties) of `Person`. The `Person[key]` part references the value of each key and associates it with the newly created types.

## Transforming Property Types

Mapped Types not only allow us to transform an existing type but also let us manipulate the type of the properties. For example, we can change the type of a property from a `string` to a `number`.

```typescript
type Person = {
  firstname: string;
  lastname: string;
  age: number;
};

type PersonNumber = {
  [key in keyof Person]: number;
};

type PersonToString = {
  [key in keyof Person]: string;
};
```

In the example above, we create two types `PersonNumber` and `PersonToString` where all properties `Person` are transformed respectively to the `number` and `string` types. 

## Conditional Types

In addition to simple mappings, Mapped Types can also use conditions to transform types. This can be useful when needing to add constraints and perform operations on types in a more generic way. 

```typescript
type Person = {
  firstname: string;
  lastname: string;
  age: number;
  isMarried: boolean;
};

type OptionalAndNullablePerson<T> = {
  [key in keyof T]?: T[key] | null;
};

type NullablePerson = OptionalAndNullablePerson<Person>;

type NullableAndMaybeMarriedPerson<T> = {
  [key in keyof T]?: T[key] | null;
} & { isMarried?: true };

type NullableAndMaybeMarried = NullableAndMaybeMarriedPerson<Person>;
```

In the example above, we create two types: `NullablePerson` and `NullableAndMaybeMarriedPerson`.

`NullablePerson` type transforms all properties of the `Person` type into types that can either be optional or nullable. 

```typescript
type OptionalAndNullablePerson<T> = {
  [key in keyof T]?: T[key] | null;
};

type NullablePerson = OptionalAndNullablePerson<Person>;
```

In the case of `NullableAndMaybeMarriedPerson`, we add an extra condition that ensures the `isMarried` property to be nullable or optional while the rest are the same as `NullablePerson`.

```typescript
type NullableAndMaybeMarriedPerson<T> = {
  [key in keyof T]?: T[key] | null;
} & { isMarried?: true };

type NullableAndMaybeMarried = NullableAndMaybeMarriedPerson<Person>;
```

Mapped Types provides a powerful feature in Typescript that allows us to create new types from existing ones. Mapped types give the ability to create transformations on property types or modify existing types to create new types. 

In summary, Mapped Types can:

- Create read-only versions of existing types.
- Create partial types with optional properties or nullable values.
- Create new types with the same properties but different types.
- Replace the value of certain properties with another type.
- Employ conditions to create new types. 

Mapped Types can help increase the simplicity and clarity of your code by creating one-off types rather than repeating type definitions throughout your application.

## Conclusion

Whilst simple in concept, Mapped Types can unlock a whole range of potential in TypeScript. It allows anyone using TypeScript to explore and transform the complexities of existing types to create new types that are better suited to their needs. Whether it’s adding optional or nullable fields or creating entirely new types with different property types, Mapped Types have a range of useful applications.