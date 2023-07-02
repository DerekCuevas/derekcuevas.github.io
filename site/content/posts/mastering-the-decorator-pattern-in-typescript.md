---
title: "Mastering the Decorator Pattern in TypeScript"
date: 2023-07-02T18:02:14.271Z
tags: ["typescript","design pattern","decorator pattern"]
authors: ["gpt-3.5-turbo-0301"]
---


# Mastering the Decorator Pattern in TypeScript

The Decorator pattern is a structural design pattern that allows you to dynamically add behaviors and functionalities to an object without altering its structure. It provides a flexible alternative to subclassing for extending functionality in an object at runtime. In this article, we'll explore how to implement the Decorator pattern in TypeScript with practical examples.

## Basic Implementation

The basic structure of the Decorator pattern consists of a Component interface, a ConcreteComponent class, and one or more Decorator classes that all implement the Component interface. The Decorator classes wrap the ConcreteComponent object and add new functionalities or behaviors.

Let's see an example implementation of the Decorator pattern for a Coffee ordering application. First, we define our Component interface:

```typescript
interface Coffee {
  getCost(): number;
  getDescription(): string;
}
```

Next, we provide a ConcreteComponent implementation for our Component interface:

```typescript
class SimpleCoffee implements Coffee {
  getCost() {
    return 10;
  }

  getDescription() {
    return "Simple coffee";
  }
}
```

Our SimpleCoffee class simply implements the Coffee interface and provides a basic implementation for getCost() and getDescription().

Now, suppose we want to add the ability to add milk and sugar to our coffee. We can use the Decorator pattern to create two separate decorators, one for adding milk and one for adding sugar.

```typescript
class MilkDecorator implements Coffee {
  private coffee: Coffee;

  constructor(coffee: Coffee) {
    this.coffee = coffee;
  }

  getCost() {
    return this.coffee.getCost() + 2.5;
  }

  getDescription() {
    return `${this.coffee.getDescription()}, milk`;
  }
}

class SugarDecorator implements Coffee {
  private coffee: Coffee;

  constructor(coffee: Coffee) {
    this.coffee = coffee;
  }

  getCost() {
    return this.coffee.getCost() + 1;
  }

  getDescription() {
    return `${this.coffee.getDescription()}, sugar`;
  }
}
```

Our MilkDecorator and SugarDecorator classes take a Coffee object as a constructor argument and add functionalities to it. Each of these Decorator classes implements the Coffee interface as we want to keep the same interface for all components and decorators.

Finally, we can use these decorators to decorate our SimpleCoffee object:

```typescript
const simpleCoffee = new SimpleCoffee();
const coffeeWithMilk = new MilkDecorator(simpleCoffee);
const coffeeWithMilkAndSugar = new SugarDecorator(coffeeWithMilk);

console.log(coffeeWithMilkAndSugar.getDescription()); // Output: Simple coffee, milk, sugar
console.log(coffeeWithMilkAndSugar.getCost()); // Output: 13.5
```

As we can see, we can use multiple decorators to add functionality to our SimpleCoffee object without changing its internal structure.

## Decorators with Parameters

In some cases, we may want to add parameters to our Decorator classes. This can be achieved by adding a constructor to our Decorator classes.

Let's see an example implementation of a MilkDecorator that allows us to set the amount of milk to be added:

```typescript
class MilkDecorator implements Coffee {
  private coffee: Coffee;
  private milkAmount: number;

  constructor(coffee: Coffee, milkAmount: number) {
    this.coffee = coffee;
    this.milkAmount = milkAmount;
  }

  getCost() {
    return this.coffee.getCost() + 2.5;
  }

  getDescription() {
    return `${this.coffee.getDescription()}, ${this.milkAmount}ml milk`;
  }
}
```

Our MilkDecorator now takes a second argument, milkAmount, which allows us to specify the amount of milk to be added to the coffee. We can use this decorator as follows:

```typescript
const simpleCoffee = new SimpleCoffee();
const coffeeWithMilk = new MilkDecorator(simpleCoffee, 50);

console.log(coffeeWithMilk.getDescription()); // Output: Simple coffee, 50ml milk
console.log(coffeeWithMilk.getCost()); // Output: 12.5
```

## Conclusion

The Decorator pattern provides a flexible way to add functionality to an object at runtime without changing its internal structure. In TypeScript, we can use interfaces and classes to implement this pattern. With the additional capability to add parameters to our Decorator classes, we can create highly customizable behavior-enhancing decorators.

By mastering the Decorator pattern, developers can create more flexible and modular applications that are easier to maintain, test, and extend.