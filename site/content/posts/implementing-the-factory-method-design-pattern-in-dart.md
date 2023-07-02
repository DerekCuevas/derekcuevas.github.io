---
title: "Implementing the Factory Method Design Pattern in Dart"
date: 2023-06-12T06:02:54.804Z
tags: ["dart","design patterns","factory method"]
authors: ["gpt-3.5-turbo-0301"]
---



In object-oriented software development, design patterns play an essential role in solving recurring problems and creating reusable solutions. One such design pattern is the Factory Method pattern, which helps define an interface for creating objects but delegates the task of object instantiation to sub-classes, thus providing flexibility and decoupling the calling code from the concrete implementation.

In this post, we’ll discuss the Factory Method design pattern in the context of Dart programming language. We’ll cover the pattern’s definition, implementation, benefits, and drawbacks, along with some Dart code examples to illustrate the pattern’s usage.

## What is the Factory Method Design Pattern?

The Factory Method is a creational design pattern that defines an interface for creating objects but lets sub-classes decide which class to instantiate. The pattern promotes code reuse and flexibility by decoupling the calling code from the actual object creation.

The Factory Method pattern consists of four basic components:

- Product: The abstract class or interface that defines the object type that the Factory Method creates.
- Concrete Product: The concrete classes that implement the `Product` interface.
- Creator: The abstract class that declares the Factory Method as an abstract method for creating `Product` objects.
- Concrete Creator: Concrete classes that inherit from `Creator` and provide an implementation for the Factory Method that returns an instance of a `Concrete Product`.

The Creator is usually an abstract class or an interface that defines the Factory Method and any other creation-related methods. The Concrete Creator provides an implementation for the Factory Method as well as any other applicable methods.

## Implementing the Factory Method in Dart

Now that we’ve got a clear understanding of the Factory Method, let’s implement it in Dart.

In our example, we’ll create a Toy Factory that produces different types of toys, such as Cars, Dolls, and Action Figures. The abstract class `Toy` represents the product, and the concrete classes, `Car`, `Doll` and `ActionFigure`, represent the corresponding concrete products. The `ToyFactory` is the Creator, and `ToyFactoryImpl` is the Concrete Creator.

Here is the code for the `Toy` abstract class:

```dart
abstract class Toy {
  void play();
}
```

The `Toy` class declares a single method, `play()`, that defines the functionality common to all concrete products.

Next, we’ll define the `Car`, `Doll` and `ActionFigure` concrete classes:

```dart
class Car implements Toy {
  @override
  void play() {
    print('Playing with a car toy');
  }
}

class Doll implements Toy {
  @override
  void play() {
    print('Playing with a doll toy');
  }
}

class ActionFigure implements Toy {
  @override
  void play() {
    print('Playing with an action figure toy');
  }
}
```

Each concrete class implements the `Toy` interface and overrides the `play()` method to define its own behavior.

Now, let's implement the `ToyFactory` abstract class:

```dart
abstract class ToyFactory {
  Toy createToy(String type);
}
```

The `ToyFactory` class defines the Factory Method `createToy()` which creates a new `Toy` object based on the given `type`.

Finally, we’ll create the Concrete Creator `ToyFactoryImpl` which implements the `ToyFactory`.

```dart
class ToyFactoryImpl implements ToyFactory {
  @override
  Toy createToy(String type) {
    switch (type) {
      case 'car':
        return Car();
      case 'doll':
        return Doll();
      case 'action-figure':
        return ActionFigure();
      default:
        throw Exception('Invalid toy type');
    }
  }
}
```

The `ToyFactoryImpl` class provides an implementation for the `createToy()` method, which returns a new concrete object based on the `type` argument. The method uses a switch statement to determine which concrete object to create and returns a new instance of the corresponding concrete class.

## Usage

To create a new `Toy` object, we need to use an instance of the `ToyFactoryImpl` class. Here is an example usage:

```dart
void main() {
  final factory = ToyFactoryImpl();
  final carToy = factory.createToy('car');
  final dollToy = factory.createToy('doll');
  final actionFigureToy = factory.createToy('action-figure');

  carToy.play(); // Playing with a car toy
  dollToy.play(); // Playing with a doll toy
  actionFigureToy.play(); // Playing with an action figure toy
}
```

The `main()` method creates a new instance of `ToyFactoryImpl` and uses it to create three different `Toy` objects. It then calls the `play()` method on each object.

## Benefits and Drawbacks

One of the primary benefits of the Factory Method pattern is its ability to promote code reuse by centralizing the creation of objects. The pattern provides a clear separation of concerns by delegating object creation to the Concrete Creator, which removes the responsibility from the calling code.

Another advantage of this pattern is its flexibility. The Factory Method pattern allows for the use of different Concrete Creators with different implementation details without modifying the calling code. This feature provides the ability to extend the existing hierarchy, making it possible to add new types of products without modifying the existing code.

However, applying this pattern to a small project or a project with a few concrete types might end up with overly complex and redundant code. Moreover, it might make debugging more challenging because of the increased number of objects and interleaved responsibilities.

## Conclusion

In conclusion, we discussed the Factory Method design pattern, its implementation, usage, benefits, and drawbacks in the context of Dart programming language. The Factory Method pattern provides a means for creating objects and promoting code reuse while allowing for flexibility. It can be a useful tool for large-scale and long-term projects that have many concrete types.