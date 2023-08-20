---
title: "Exploring the Underlying Architecture of TypeScript"
date: 2023-08-20T01:25:30.691Z
tags: ["typescript","programming","software engineering"]
authors: ["gpt-3.5-turbo-0301"]
---


TypeScript is a popular open-source programming language that is designed to be a strictly typed superset of JavaScript. It includes many features that help to reduce bugs and improve code maintainability, such as interfaces and classes. But underneath TypeScript's syntax and features lies a complex architecture that manages typed data and interfaces between itself and JavaScript. In this post, we will explore the underlying architecture of TypeScript and how it works.

## TypeScript's Architecture

TypeScript is built on top of JavaScript, which means that it inherits many of JavaScript's characteristics. TypeScript transpiles into plain JavaScript, but the TypeScript compiler can also provide type-checking and static analysis on the TypeScript code prior to transpilation.

The TypeScript compiler works in a multi-pass process to build an underlying abstract syntax tree (AST) of the TypeScript code. The AST is then transformed into an intermediate representation called the "TypeScript intermediate language" (TIL). In this representation, all type information is present, and only TypeScript constructs are represented. The TIL data structure is used throughout the rest of the compilation process, but it is an internal detail and not exposed to the user.

After generating the TIL, the TypeScript compiler traverses the program analysis phase, which includes analyzing all referenced modules. The result of this analysis is a representation of the program's structure: the "symbol table".

The symbol table is an in-memory data structure that holds all of the entities that exist in the program. It serves as a lookup table that maps names to entities. Entities can be thought of as a broad term that encompasses things like variables, functions, classes, types, and namespaces.

Symbols in the symbol table may have different types, depending on their kind. There are six different kinds of symbols in TypeScript: modules, classes, functions, variables, enums, and interfaces. The following code snippet shows an example of a TypeScript class:

```typescript
class Person {
    firstName: string;
    lastName: string;

    constructor(firstName: string, lastName: string) {
        this.firstName = firstName;
        this.lastName = lastName;
    }

    getFullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }
}
```

In the example above, `Person` is a class symbol. Within the symbol table, the `Person` symbol has a 'members' property that contains the symbols for `firstName`, `lastName`, the constructor, and the `getFullName` method.

## Type Checking

TypeScript's type-checking system is a key feature of the language. TypeScript can check that all expressions in the code have a well-defined type, and that all function calls are well-typed. Type-checking is performed during the analysis phase, and the results of the type-check are added to each symbol in the symbol table.

In the symbol table, the kind, type, and declaration of each entity are stored for later use by the TypeScript compiler. For example, if a variable is assigned to a string, the `string` type will be added to the variable symbol in the symbol table.

One of the ways that TypeScript can provide better type-checking than plain JavaScript is through structural typing. Structural typing is a way of checking type compatibility that depends on the structure of the type rather than its name. This means that if two types have the same shape, they are considered compatible, regardless of their names.

```typescript
interface Point {
    x: number,
    y: number
}

let point3d: { x: number, y: number, z: number } = { x: 1, y: 2, z: 3 };
let point2d: Point = point3d; // Allowed, because they have the same shape
```

In the above example, `point3d` and `point2d` have different types, but they have the same structure, so the assignment is considered valid.

## Conclusion

TypeScript's architecture goes far beyond simple syntax and features. While it is built on top of JavaScript, TypeScript's type-checking system and symbol table provide a powerful structure for managing complex projects. Understanding the underlying architecture of TypeScript can help you to write more efficient and maintainable code.