---
title: "Mastering Rust's Futures: An Advanced Guide"
date: 2023-07-31T01:31:57.488Z
tags: ["rust","systems programming","asynchronous programming"]
authors: ["gpt-3.5-turbo-0301"]
---




# Mastering Rust's Futures: An Advanced Guide

Rust's futures abstraction has been a game-changer for writing asynchronous code. Rust's integration of non-blocking I/O made it natural for Rust's community to advance into the direction of async/await design patterns. In this post, we will dive deeper into Rust's futures and understand how to use this abstraction to write cleaner, more maintainable, and efficient asynchronous code. 

## Table of Contents

- What Are Futures?
- Advantages of Futures
- Raising Errors in Futures
- Awaiting Multiple Futures
- Running Futures
- Conclusion


## What Are Futures?

A `Future` is a fundamental Rust abstraction from Rust's standard library responsible for asynchronous computation. A future represents a value that might not be available yet, but will be evaluated at some point in the future. Futures are the foundation for Rust's asynchronous programming and many high-level abstractions in common Rust libraries, including `async-std` and `tokio`. 

Futures are like JavaScript promises that, when combined with the Rust `await` keyword, make for clean and efficient code. Here is a simple example of a `Future` in Rust:

```rust
use futures::executor::block_on;

async fn add(a: i32, b: i32) -> i32 {
    a + b
}

fn main() {
    let sum = block_on(add(3, 5));
    println!("3 + 5 = {}", sum);
}
```

This simple example creates and runs an asynchronous function `add` that adds two numbers together and returns it as a future. Note that the function is declared using the `async` keyword. 

Quickly running this code provides the following output:
```
3 + 5 = 8
```

As expected, the `add` function adds the two numbers, `a` and `b` together. Understanding the foundation of futures - that the code in the future may not complete before other code, namely the executor, is executed - is crucial to understanding Rust's async system.

## Advantages of Futures

Futures have several advantages over traditional threading and blocking abstractions, namely because they allow developers to write asynchronous code in a sequential manner, making code more organized and maintainable. 

Futures enable developers to use Rust's lightweight and deterministic system threads (called "green threads" or "coroutines"), without needing a full blown OS thread to handle each concurrent request as in traditional programming models like Java and C#.

Additionally, Futures allow for an efficient implementation of the "actor pattern," which can be useful for microservices. With the actor pattern, message-passing is used between operations, enabling a clean separation of concerns and avoiding data races in shared memory.

## Raising Errors in Futures

When working with functions that might produce errors, we need to raise them up to our calling functions. In Rust's case, when working with futures, we use the [`Result`](https://doc.rust-lang.org/std/result/) containing trait, `TryFuture`, which is implemented for futures whose `Output` is a `Result`. 

Let's see a quick example:

```rust
use std::io;
use futures::io::AsyncReadExt;

async fn run() -> Result<(), io::Error> {
    let mut stdin = io::stdin();
    let mut line = String::new();

    stdin.read_line(&mut line).await.map_err(|e| io::Error::new(io::ErrorKind::Other, e))?;

    Ok(())
}

fn main() {
    block_on(run()).unwrap();
}
```

Here, we're using the [`AsyncReadExt`](https://docs.rs/futures/0.3.17/futures/io/trait.AsyncReadExt.html) trait to read a single line from stdin. Since the underlying operation IO operation could fail at any point in time and is therefore performed asynchronously, we use Rust's Result type as output for our function, `run`.

We use the `map_err` function to convert a possible IO error to an other error type. We use the `?` operator to early return and propagate the error to our calling function.

## Awaiting Multiple Futures

It's common to have functions that need to fetch data from multiple sources or perform several I/O operation before continuing. Futures provide a clean and efficient way to deal with this problem. 

Rust provides the [`join!`] macro, which allows execution of multiple futures and awaits on all of them to complete. This can be seen as analogous to a type of async "parallelism". 

Here's an example:

```rust
use futures::join;
use std::io;

async fn get_input(prompt: &str) -> String {
    let mut input = String::new();
    println!("{}", prompt);

    io::stdin().read_line(&mut input).await.unwrap();

    input
}

async fn run() {
    let (name, age, city) = join!(
        get_input("Enter your name: "),
        get_input("Enter your age: "),
        get_input("Enter your city: ")
    );

    println!(
        "Hey, my name is {} and I'm {}, and I live in {}!",
        name.trim(),
        age.trim(),
        city.trim()
    );
}

fn main() {
    block_on(run());
}
```

In this example, we're using multiple futures together using the `join!` macro. The `join!` macro implicitly awaits the passed futures and blocks until all of them are complete, at which point their results are returned as a tuple.

## Running Futures

Running a Rust `Future` is done with an executor. Executors are libraries that provide the runtime environment for futures, which is responsible for managing the execution of futures. Rust provides several libraries that can be used as executors, including `async-std`, `tokio`, and `smol`. 

Here is an example of using the `async-std` executor:

```rust
use async_std::task; 

async fn add(a: i32, b: i32) -> i32 {
    a + b
}

fn main() {
    let handle =
        task::spawn(async move { add(5, 5).await });
    let sum = block_on(handle).unwrap();
    println!("5 + 5 = {}", sum);
}
```

Here, we are using the `async_std` package to spawn a task that runs the `add` function asynchronously. We then use the `block_on` function from the `futures` crate to wait for the result of the task to complete.

## Conclusion

Rust's `Future` abstraction provides a powerful and expressive way to write asynchronous Rust code. Futures provide many benefits over traditional threading and blocking abstractions, enabling developers to write code that is more organized, maintainable, and efficient. With a broad range of available executors and abstractions built on top of the `Future` abstractions, Rust is becoming a popular language for building efficient and performant asynchronous systems.