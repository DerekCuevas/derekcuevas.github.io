---
title: "Mastering the Observer Design Pattern in Rust"
date: 2023-06-26T00:06:06.583Z
tags: ["rust","design patterns","observer"]
authors: ["gpt-3.5-turbo-0301"]
---

# Introduction
When building software systems, it is common to need to notify objects of changes in state that occur elsewhere. The Observer design pattern provides a clean and efficient way to accomplish this. This pattern involves two types of objects - Observables (also called Subjects) and Observers. Observables are responsible for maintaining a list of associated observers, and notifying these observers of relevant changes. Observers register themselves with an Observable and are notified whenever the Observable changes.

In this post, we will explore how to use the Observer design pattern in Rust. We will first provide an overview of the pattern, before diving into a practical example and discussing the advantages and disadvantages of using the Observer pattern.

# Overview
Let's start by defining the two main components of the Observer design pattern, the Observable and the Observer.

## Observable
The Observable is responsible for maintaining a list of associated Observers and notifiying these observers of relevant changes. The Observable can be implemented as a class with the following methods:
- `attach(observer: &Observer)` to add an observer to the list of attached observers.
- `detach(observer: &Observer)` to remove an observer from the list of attached observers.
- `notify()` which notifies all attached observers by calling their `update()` method.

## Observer
The Observer is an interface that specifies the `update()` method, which is called by the Observable when there is a relevant change. Observers that need to be notified of changes must implement this interface.

# Example
Now let's dive into an example implementation of the Observer pattern in Rust.

Suppose we have a struct `TemperatureSensor` that measures the temperature and is capable of notifying other objects (observers) of changes to the temperature. We will implement the Observable as a struct called `Observable<T>` that can be reused with other types. We will implement the Observer as a trait called `Observer`.

```rust
use std::sync::{Arc, Mutex};

trait Observer<T> {
    fn update(&self, data: &T);
}

struct TemperatureSensor {
    temperature: f64,
    observers: Arc<Mutex<Vec<Box<dyn Observer<f64>>>>>,
}

impl TemperatureSensor {
    fn new(temperature: f64) -> TemperatureSensor {
        TemperatureSensor {
            temperature: temperature,
            observers: Arc::new(Mutex::new(Vec::new())),
        }
    }

    fn add_observer(&mut self, observer: Box<dyn Observer<f64>>) {
        self.observers.lock().unwrap().push(observer);
    }

    fn remove_observer(&mut self, observer: &dyn Observer<f64>) {
        let mut guards = self.observers.lock().unwrap();
        let pos = guards.iter().position(|o| &**o as &dyn Observer<f64> == observer).unwrap();
        guards.remove(pos);
    }

    fn update(&mut self, temperature: f64) {
        self.temperature = temperature;
        self.notify_observers();
    }

    fn notify_observers(&mut self) {
        let guards = self.observers.lock().unwrap();
        for observer in guards.iter() {
            observer.update(&self.temperature);
        }
    }
}

impl<T: Observer<f64> + 'static> Observer<f64> for T {
    fn update(&self, data: &f64) {
        println!("{} - Temperature changed to: {}", std::any::type_name::<Self>(), *data);
    }
}
```

We define the `Observer` trait with a generic type parameter `T`. The trait contains a single `update()` method that takes a reference to generic type `T`.

Next, we define a `TemperatureSensor` struct with a `temperature` field and an `observers` field, which is a vector of boxes containing any objects that implement the `Observer` trait.

The `TemperatureSensor` struct has the following methods:
- `new()` creates a new `TemperatureSensor` with an initial temperature value.
- `add_observer()` adds an observer to the list of observers.
- `remove_observer()` removes an observer from the list of observers.
- `update()` updates the temperature value and notifies the observer of the change.
- `notify_observers()` notifies all observers by calling their `update()` method.

Finally, we define a function that implements the `Observer` trait by printing the type of observer and the new value of the temperature.

# Advantages and disadvantages
The Observer pattern has several advantages:
- Decouples the subject and observer, reducing dependencies and making it easier to change or add new observers without affecting other parts of the system.
- Supports broadcast communication between the subject and its observers, making it easy to notify multiple objects of a single event.
- Open/Closed Principle: Observers can be added or removed without having to modify the subject.

However, the Observer pattern also has some disadvantages:
- The subject may send notifications to observers that do not need to receive updates, resulting in inefficiencies.
- The design of the pattern can be complex, requiring careful implementation to ensure accuracy and consistency.

# Conclusion
The Observer design pattern provides a clean and flexible way to notify observers of changes to an object's state. In this post, we have explored how to use the Observer pattern in Rust, with a practical example and discussion of the advantages and disadvantages of the pattern. By using the Observer pattern, we can improve the decoupling of our code, making it more flexible and efficient.