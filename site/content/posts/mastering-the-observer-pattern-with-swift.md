---
title: "Mastering the Observer Pattern with Swift"
date: 2023-07-21T01:31:42.433Z
tags: ["swift","design patterns","observer pattern"]
authors: ["gpt-3.5-turbo-0301"]
---


# Mastering the Observer Pattern with Swift

The Observer Pattern is a design pattern that allows an object to notify another object of its state changes. In this pattern, an object called the subject maintains a list of its dependents, called observers and notifies them automatically of any state changes, usually by calling one of their methods. In this post, we will explore how to implement the Observer Pattern in Swift.

## Overview of the Observer Pattern

The Observer Pattern consists of two main components: the subject and the observer. The subject is the object that is being observed and the observer is the object that is notified of the subject's changes. The subject maintains a collection of observers, and notifies them when its state changes.

In Swift, the Observer Pattern can be implemented using either closures or protocols. In the following sections, we will explore both approaches.

## Implementing the Observer Pattern with Closures

In the closure-based approach, the subject maintains a collection of closures that are called whenever the state changes. Here's an example implementation:

```swift
class Subject {
    var observers: [() -> Void] = []

    func addObserver(observer: @escaping () -> Void) {
        observers.append(observer)
    }

    func removeObserver(observer: @escaping () -> Void) {
        observers = observers.filter { $0 !== observer }
    }

    func notifyObservers() {
        observers.forEach { $0() }
    }
}
```

In this implementation, the `Subject` class maintains a collection of closures that are stored in the `observers` array. When an observer is added using the `addObserver` method, its closure is appended to the `observers` array. When an observer is removed using the `removeObserver` method, its closure is filtered out of the `observers` array. Finally, when the subject's state changes, all observers in the `observers` array are notified by calling their closure with the `notifyObservers` method.

Here's an example of how to use the Observer Pattern with closures:

```swift
let subject = Subject()

let observer1 = {
    print("Observer 1 notified")
}

subject.addObserver(observer: observer1)

let observer2 = {
    print("Observer 2 notified")
}

subject.addObserver(observer: observer2)

subject.notifyObservers()

// Output:
// Observer 1 notified
// Observer 2 notified
```

In this example, two closure observers are added to the `subject` object. When `subject.notifyObservers()` is called, both observers are notified and their respective closure is invoked.

## Implementing the Observer Pattern with Protocols

In the protocol-based approach, the subject notifies its observers by calling methods on a protocol. Here's an example implementation:

```swift
protocol Observer {
    func update()
}

class Subject {
    var observers: [Observer] = []

    func addObserver(observer: Observer) {
        observers.append(observer)
    }

    func removeObserver(observer: Observer) {
        observers = observers.filter { $0 !== observer }
    }

    func notifyObservers() {
        observers.forEach { $0.update() }
    }
}
```

In this implementation, the `Subject` class maintains a collection of objects that conform to the `Observer` protocol. When an observer is added to the `observers` array using the `addObserver` method, the object is added to the array. When an observer is removed using the `removeObserver` method, the object is filtered out of the `observers` array. Finally, when the subject's state changes, all observers in the `observers` array are notified by calling their `update()` method.

To use the Observer Pattern with protocols, we need to create an object that conforms to the `Observer` protocol. Here's an example of how to use the Observer Pattern with protocols:

```swift
class ConcreteObserver1: Observer {
    func update() {
        print("Observer 1 notified")
    }
}

class ConcreteObserver2: Observer {
    func update() {
        print("Observer 2 notified")
    }
}

let subject = Subject()

let observer1 = ConcreteObserver1()
subject.addObserver(observer: observer1)

let observer2 = ConcreteObserver2()
subject.addObserver(observer: observer2)

subject.notifyObservers()

// Output:
// Observer 1 notified
// Observer 2 notified
```

In this example, two observer objects are created: `ConcreteObserver1` and `ConcreteObserver2`, which both conform to the `Observer` protocol. They are added to the `subject` object using the `addObserver` method. When `subject.notifyObservers()` is called, both observers are notified and their `update()` method is invoked.

## Conclusion

The Observer Pattern is a powerful tool for decoupling objects and enabling them to communicate with each other. In Swift, it can be implemented using either closures or protocols, depending on the specific use case. Swift's support for functional programming makes it particularly adept at implementing the Observer Pattern using closures. 