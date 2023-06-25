---
title: "Mastering the Decorator Design Pattern in TypeScript"
date: 2023-06-25T00:43:59.976Z
tags: ["typescript","design patterns","decorator pattern"]
---


Decorators are a powerful feature of TypeScript that allow for the addition of behavior to classes, methods, and properties. They are a design pattern that improves the modularity, extensibility, and reusability of software components. In this post, we will explore the decorator pattern in TypeScript, including its syntax, use cases, and best practices.

## What is the Decorator Pattern?

The Decorator Pattern is a structural design pattern that allows behavior to be added to an individual object, either statically or dynamically, without affecting the behavior of other objects from the same class. This pattern is useful when we want to add functionality to an object without modifying its source code. The pattern works by wrapping an existing object with a decorator object. The decorator object has the same interface as the original object and can perform additional actions before or after delegating to the original object.

In TypeScript, decorators are functions that can be attached to classes, methods, and properties. The functions receive the constructor function of the class or the prototype of the object as arguments. Decorators can modify the behavior of the class, method, or property by defining a new behavior or replacing the original behavior.

Consider the following example:

```typescript
function log(target: Function) {
  console.log(`Class name: ${target.name}`);
}

@log
class Person {
  name: string;
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
}
```

In this example, we define a decorator function called `log` that takes the constructor function `target` as its parameter. The decorator function logs the name of the class to the console. We apply the `log` decorator to the `Person` class using the `@` syntax.

When we instantiate an object of the `Person` class, the decorator logs `Class name: Person` to the console.

```typescript
const person = new Person('John Doe', 30);
// Output: Class name: Person
```

## Class Decorators

Class decorators are applied to the constructor of a class and can change the behavior of the entire class or its members. Class decorators are defined by functions that take the constructor function of the class as their argument. Class decorators can be used to modify the class constructor, add or remove properties and methods, or provide additional metadata.

### Example: Adding a Property to a Class

```typescript
function addProperty(target: Function) {
  Object.defineProperty(target.prototype, 'email', {
    value: 'example@example.com',
  });
}

@addProperty
class Person {
  name: string;
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
}

const person = new Person('John Doe', 30);
console.log(person.email); // Output: example@example.com
```

In this example, we define a decorator function called `addProperty` that takes the constructor function `target` as its parameter. The decorator function defines a new property named `email` on the class prototype with the value `'example@example.com'`. We apply the `addProperty` decorator to the `Person` class.

When we instantiate an object of the `Person` class, the `email` property is automatically added to the object.

### Example: Adding Metadata to a Class

```typescript
const METADATA_KEY = Symbol('permissions');

function addPermissions(permissions: string[]) {
  return function (target: Function) {
    Reflect.defineMetadata(METADATA_KEY, permissions, target);
  };
}

@addPermissions(['read', 'write'])
class Person {
  name: string;
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
}

const permissions = Reflect.getMetadata(METADATA_KEY, Person);
console.log(permissions); // Output: [ 'read', 'write' ]
```

In this example, we define a decorator function called `addPermissions` that takes an array of permissions as its argument and returns a new decorator function. The new decorator function takes the constructor function `target` as its parameter and uses the `Reflect.defineMetadata` method to add the permissions metadata to the class. We use the `Reflect.getMetadata` method to retrieve the metadata from the class.

## Method Decorators

Method decorators are applied to the methods of a class and can change the behavior of the method. Method decorators are defined by functions that take three parameters: the target object, the name of the method, and a property descriptor. Method decorators can modify the behavior of the method, replace the method with a new method, or add additional functionality before or after the method is called.

### Example: Logging the Execution of a Method

```typescript
function log(target: any, name: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    console.log(`Method name: ${name}`);
    const result = originalMethod.apply(this, args);
    return result;
  };

  return descriptor;
}

class Person {
  name: string;
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  @log
  sayHello() {
    console.log(`Hello, my name is ${this.name}`);
  }
}

const person = new Person('John Doe', 30);
person.sayHello(); // Output: Method name: sayHello, Hello, my name is John Doe
```

In this example, we define a decorator function called `log` that takes three arguments: the target object, the name of the method, and the property descriptor. The decorator function replaces the original method with a new method that logs the name of the method to the console before executing the original method. We apply the `log` decorator to the `sayHello` method of the `Person` class.

When we call the `sayHello` method on an instance of the `Person` class, the decorator logs `Method name: sayHello` to the console before executing the original method.

## Property Decorators

Property decorators are applied to the properties of a class and can change the behavior of the property. Property decorators are defined by functions that take two parameters: the target object and the property key. Property decorators can modify the property value, replace the property with a new property, or add additional functionality before or after the property is accessed.

### Example: Encrypting a Property Value

```typescript
function encrypt(target: any, key: string) {
  let val = target[key];

  const getter = function () {
    return val;
  };

  const setter = function (newVal: string) {
    val = `**${newVal}**`;
  };

  Object.defineProperty(target, key, {
    get: getter,
    set: setter,
  });
}

class Person {
  @encrypt
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}

const person = new Person('John Doe');
console.log(person.name); // Output: **John Doe**
```

In this example, we define a decorator function called `encrypt` that takes two arguments: the target object and the property key. The decorator function defines a new getter and setter for the property that encrypts the value by wrapping it in double asterisks. We apply the `encrypt` decorator to the `name` property of the `Person` class.

When we access the `name` property on an instance of the `Person` class, the decorator returns the encrypted value.

## Conclusion

Decorators are a powerful feature of TypeScript that enable the addition of behavior to classes, methods, and properties. The decorator pattern provides a clean and efficient way to add functionality to objects without modifying their source code. In this post, we explored the decorator pattern in TypeScript and its syntax, use cases, and best practices. We hope this post has given you a solid foundation for using decorators in your TypeScript projects.