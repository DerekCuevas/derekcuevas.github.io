---
title: "Understanding the Difference Between Structs and Enums in Rust"
date: 2023-05-29T02:17:21.444Z
tags: ["rust","structs","enums"]
---

Rust is a powerful programming language that is quickly becoming a popular choice for building high-performance applications. Among its many features, Rust has a unique way of handling data structures, which can be difficult to understand for newcomers to the language. Specifically, the differences between structs and enums can be confusing at first. In this post, we'll take a deep dive into these two data structures and explore their strengths and weaknesses.

## Structs

In Rust, a `struct` is a data structure that allows you to group multiple values of different types into a single, named object. Here's an example of a struct that represents a `Person`:

```rust
struct Person {
    name: String,
    age: u32,
}
```

In this example, the `Person` struct has two fields: `name`, which is of type `String`, and `age`, which is of type `u32`. By grouping these values together into a single `Person` object, we can easily pass it around our codebase and use it to represent individuals in our application.

Structs are useful when you need to store a collection of related data together. They provide a way to create custom data types that are specific to your application's needs, allowing you to write clearer, more concise code.

## Enums

While structs group related data together, enums are designed to group related values together. An `enum` in Rust is a data structure that allows you to define a type by enumerating its possible values. Here's an example of an enum that represents `Color`:

```rust
enum Color {
    Red,
    Green,
    Blue,
}
```

In this example, we define the `Color` enum to have three possible values: `Red`, `Green`, and `Blue`. Each of these values is defined as a separate variant of the enum.

Enums are useful when you have a fixed set of values that a variable can take on. Rather than using a plain variable that can have any value, you can use an enum to limit the possible values to a specific set. This makes your code easier to read and less prone to errors.

## Differences between Structs and Enums

While structs and enums may seem similar, there are some key differences between them that are important to understand.

### Accessing Fields

One of the biggest differences between structs and enums is how you access their fields. In a struct, each field is given a name, and you can access individual fields using dot notation:

```rust
let person = Person {
    name: "Alice".to_string(),
    age: 30,
};

println!("Name: {}", person.name);
println!("Age: {}", person.age);
```

In an enum, you can't access its variants' fields in the same way. Instead, you need to use pattern matching to extract the relevant fields:

```rust
enum Coin {
    Penny,
    Nickel,
    Dime,
    Quarter(UsState),
}

fn value_in_cents(coin: Coin) -> u32 {
    match coin {
        Coin::Penny => 1,
        Coin::Nickel => 5,
        Coin::Dime => 10,
        Coin::Quarter(state) => {
            println!("State quarter from {:?}!", state);
            25
        },
    }
}
```

In this example, the `Coin::Quarter` variant has an associated value of type `UsState`. When we match on a value of type `Coin`, we use a pattern that includes the `Coin::Quarter` variant, along with its associated value. We bind the `state` variable to the associated value so that we can use it in the function.

### Pattern Matching

Speaking of pattern matching, it's worth noting that enums are much more powerful when it comes to pattern matching than structs. By defining an enum with multiple variants, you can create complex patterns that match only certain combinations of values.

Here's an example that uses an enum to represent a `Message`:

```rust
enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
    ChangeColor(i32, i32, i32),
}

impl Message {
    fn call(&self) {
        // method body would be defined here
    }
}

let msg = Message::ChangeColor(255, 0, 255);
msg.call();
```

In this example, we define the `Message` enum to have four variants: `Quit`, `Move`, `Write`, and `ChangeColor`. The `Move` variant has two fields of type `i32`, and the `Write` variant has a field of type `String`. We've also defined a method on the `Message` enum that can be called on any of its variants.

We can create an instance of the `Message` enum using one of its variants, and then call the `call` method on it. This allows us to provide a common interface across all of our message types, making our code more flexible and easier to reason about.

## Conclusion

Both structs and enums are powerful data structures that can help you write cleaner, more concise code in Rust. By understanding the differences between them, you'll be able to choose the right one for your particular use case, and write better code as a result.