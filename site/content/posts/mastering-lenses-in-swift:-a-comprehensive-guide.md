---
title: "Mastering Lenses in Swift: A Comprehensive Guide"
date: 2023-09-08T01:25:23.146Z
tags: ["swift","functional programming","lens"]
authors: ["gpt-3.5-turbo-0301"]
---


## Introduction

Functional programming is a programming paradigm that focuses on functions as primary building blocks, and immutable data as primary inputs and outputs. Lenses are a functional programming concept that provide a way to access and modify nested data structures in a composable and type-safe manner.

In this post, we will explore what lenses are, and how to use them in Swift. We will start with the basics of functional programming, move on to lenses, and then delve into some advanced topics. By the end of this post, you'll have a solid understanding of lenses, and be able to use them in your own code.

## Functional Programming Basics

Swift supports many concepts from functional programming, including first-class functions, immutability, and higher-order functions. Let's start by reviewing these concepts briefly.

### First-Class Functions

In Swift, functions are first-class citizens. This means that functions can be used just like any other type, including being passed as arguments to other functions, returned from functions, and stored in variables or constants. Here is an example:

```swift
func timesTwo(_ x: Int) -> Int {
    return x * 2
}

let array = [1, 2, 3, 4, 5]
let newArray = array.map(timesTwo)
print(newArray) // [2, 4, 6, 8, 10]
```

In this example, `timesTwo` is a function that takes an `Int` and returns an `Int`. We then use this function as an argument to the `map` function, which applies `timesTwo` to each element of the array, and returns a new array with the results.

### Immutability

In functional programming, data is immutable. This means that once a value is created, it cannot be changed. Instead, new values are created based on old values. Immutability has many advantages, including thread safety, more predictable code, and easier debugging.

Here's an example of immutability in Swift:

```swift
struct Point {
    let x: Int
    let y: Int
}

let point = Point(x: 2, y: 3)
let newPoint = Point(x: point.x + 1, y: point.y + 1)
print(newPoint) // Point(x: 3, y: 4)
```

In this example, `Point` is a struct with two immutable properties, `x` and `y`. We create a new point based on an old point, but we do not modify the original point.

### Higher-Order Functions

Higher-order functions are functions that take one or more functions as arguments, and/or return a function as a result. Functions like `map`, `filter`, and `reduce` are examples of higher-order functions.

```swift
let array = [1, 2, 3, 4, 5]
let evenArray = array.filter { $0 % 2 == 0 }
print(evenArray) // [2, 4]
```

In this example, `filter` is a higher-order function that takes a closure as an argument. The closure `$0 % 2 == 0` tests whether a given element of the array is even or odd.

## Lenses

Now that we've covered the basics of functional programming, let's talk about lenses. A lens is a functional programming construct that provides a way to get and set nested values in an immutable data structure. Think of a lens as a "window" into a data structure, that allows us to see and modify a specific part of it.

### Creating a Lens

In Swift, a lens is typically implemented as a pair of functions: a `get` function that gets a value from a data structure, and a `set` function that sets a value in a data structure. Here's an example:

```swift
struct Person {
    let name: String
    let address: Address
}

struct Address {
    let street: String
    let city: String
}

let person = Person(name: "Alice",
                    address: Address(street: "123 Main Street",
                                      city: "Anytown"))

func addressLens() -> Lens<Person, Address> {
    return Lens(
        get: { (person: Person) -> Address in return person.address },
        set: { (address: Address) -> (Person) -> Person in
            return { (person: Person) -> Person in
                return Person(name: person.name, address: address)
            }
        }
    )
}

let lens = addressLens()
let address = lens.get(person)
print(address) // Address(street: "123 Main Street", city: "Anytown")

let newPerson = lens.set(Address(street: "456 First Ave", city: "New City"))(person)
print(newPerson) // Person(name: "Alice", address: Address(street: "456 First Ave", city: "New City"))
```

In this example, we define a `Person` struct with a nested `Address` struct. We then define a lens for the `Address` property of the `Person` struct, using a `get` function that returns the `Address` property of a given `Person`, and a `set` function that returns a new `Person` with the `Address` property replaced.

We can use the `get` and `set` functions to get and set the `Address` property of a `Person`, respectively. The `set` function returns a new `Person` with the `Address` property replaced, but leaves the original `Person` unchanged.

### Composing Lenses

One of the key advantages of lenses is their composability. We can chain lenses together to create a lens that accesses a nested value of a nested value. Here's an example:

```swift
let person = Person(name: "Alice",
                    address: Address(street: "123 Main Street",
                                      city: "Anytown"))

func streetLens() -> Lens<Address, String> {
    return Lens(
        get: { (address: Address) -> String in return address.street },
        set: { (street: String) -> (Address) -> Address in
            return { (address: Address) -> Address in
                return Address(street: street, city: address.city)
            }
        }
    )
}

let street = compose(lens1: addressLens(), lens2: streetLens())
let streetValue = street.get(person)
print(streetValue) // "123 Main Street"

let newPerson = street.set("456 First Ave")(person)
print(newPerson) // Person(name: "Alice", address: Address(street: "456 First Ave", city: "Anytown"))
```

In this example, we define a `streetLens` for the `street` property of an `Address` struct, and then use the `compose` function to create a new lens that accesses the `street` property of a nested `Address` property of a `Person` struct.

The `compose` function takes two lenses as arguments, and returns a new lens that accesses the nested value that the two lenses access together.

### Lens Laws

Lenses have some laws that they must satisfy in order to be "correct". These laws include:

- **Get-Set:** `lens.set(lens.get(a))(a) == a` for all values `a`.
- **Set-Get:** `lens.get(lens.set(b)(a)) == b` for all values `a` and `b`.
- **Set-Set:** `lens.set(b2)(lens.set(b1)(a)) == lens.set(b2)(a)` for all values `a`, `b1`, and `b2`.

These laws ensure that lenses behave predictably and consistently, and that they can be composed safely.

## Conclusion

Lenses are a powerful tool in functional programming, allowing us to access and modify nested data structures in a type-safe and composable way. In this post, we covered the basics of functional programming in Swift, as well as how to create and compose lenses. We also discussed the lens laws, which ensure that lenses behave predictably.

With lenses, you can write more robust, predictable, and scalable code. Start using lenses in your own code today!