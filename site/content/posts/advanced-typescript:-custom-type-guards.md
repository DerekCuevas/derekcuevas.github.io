---
title: "Advanced TypeScript: Custom Type Guards"
date: 2023-06-02T12:03:36.705Z
tags: ["typescript"]
---


TypeScript is a mature statically-typed language that provides a large range of features that could be used to improve the safety and reliability of your codebase. One of these features is custom Type Guards - functions that can determine whether a specific object is of a certain type by checking it against a condition. In this post, we are going to thoroughly explore and illustrate the behavior of custom Type Guards in TypeScript, and learn how they could help us write safer and more expressive code.

## 1. Introduction

TypeScript's type system is based on the notion of interfaces. Specifically, an interface is a declaration that describes the types and structures of its fields and methods. It can also be used to check if an object has certain properties. Let's create an interface for our example:

```typescript
interface Person {
    name: string;
    age?: number;
}
```

This interface has two properties, `name` and `age`, with the latter being of optional type. 

Let's define two instances of this custom type:

```typescript
const person1: Person = { name: 'John', age: 30 };
const person2: Person = { name: 'Mary' };
```

Now let's create a function that can differentiate between each type of person instance. 

## 2. Custom Type Guard Definition

In TypeScript, a Type Guard is a function whose return type is a boolean, and which is used to narrow down the types of a variable's value. Here's a basic template for a Type Guard function:

```typescript
function isX(value: any): value is X {
    // return true if value is X
}
```

Our goal is to write a Type Guard that can differentiate between our person instances. Let's write a first version of it:

```typescript
function isPerson(person: any): person is Person {
  return person.name && typeof person.name === 'string';
}
```

Notice that to type guard `person` to `Person`, we must return `person is Person`. 

We are basically saying that if the `person` object has a `name` field, and it's of `string` type, then it can be considered to be a `Person`. Otherwise, it's not a `Person`. 

We can now use this Type Guard to check whether `person1` and `person2` are `Person`s.

```typescript
console.log(isPerson(person1)); // true
console.log(isPerson(person2)); // true
```

It works for `person1` but also for `person2`, which is odd. We can do better than that.

## 3. Improve the Type Guard

The current implementation could be improved by adding a check for the age field.

```typescript
function isPerson(person: any): person is Person {
    return person.name && typeof person.name === 'string' && typeof person.age === 'undefined' || typeof person.age === 'number';
}
```

We are basically saying that `person` must have either no `age` field, or an `age` field of type `number`. We can re-check whether `person1` and `person2` are `Person`s using the improved version:

```typescript
console.log(isPerson(person1)); // true
console.log(isPerson(person2)); // true
```

It still works for both! That's great, but let's improve our Type Guard even further, to make sure it works correctly for all cases.

```typescript
function isPerson(person: any): person is Person {
    return typeof person.name === 'string' && (typeof person.age === 'number' || typeof person.age === 'undefined');
}
```

## 4. Conclusion

TypeScript's custom Type Guards are functions that we can use to narrow down the types of variables and objects in our codebase. They can help us write safer and more expressive code, especially in cases where we need to handle multiple types of objects in our code. We demonstrated how to define custom Type Guards and how to check them with different objects. In the future, working with custom Type Guards can make your code less prone to runtime errors.