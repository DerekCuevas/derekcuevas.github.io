---
title: "Understanding Rust's Unsafe Keyword"
date: 2023-06-16T18:02:36.569Z
tags: ["rust"]
---



Rust is a powerful systems programming language that provides developers with the ability to write safe and efficient code. However, in some cases, Rust's default type and ownership system can be too restrictive, which is where the `unsafe` keyword comes in. In this article, we'll explore what the `unsafe` keyword is and how to use it safely.

## What is `unsafe` in Rust?

The `unsafe` keyword in Rust is used to indicate that a block of code requires access to memory in a way that is not safe for the Rust compiler to check for many safety guarantees. This means that code within an `unsafe` block can violate the safety guarantees of Rust, such as avoiding null pointers, data races, and undefined behavior.

Using `unsafe` allows Rust developers to write low-level code that interacts with system-level features, such as direct memory access, operating system APIs, and hardware. The `unsafe` keyword not only provides a way to write such code but also creates a boundary between safe and unsafe code, allowing the Rust compiler to perform important safety checks on safe code.

To demonstrate the use of `unsafe` in Rust, let's take a look at an example. Consider the following code snippet:

```rust
fn main() {
    let raw_pointer = 0x1234 as *mut u32;
    let value = unsafe{*raw_pointer += 1};
    println!("Value is: {}", value);
}
```

In this example, we create a raw pointer with the value `0x1234` and cast it to a mutable pointer to an unsigned 32-bit integer (`*mut u32`). We then increment the value of the pointed-to integer and assign it to a variable named `value`. Finally, we print the value of `value`.

The `unsafe` keyword is required in order to dereference the raw pointer and change the value of the pointed-to integer. Without the `unsafe` keyword, Rust would prevent us from performing this operation since it can lead to undefined behavior.

## Using `unsafe` Safely

Although the use of `unsafe` is required in some cases, it also comes with some risks. Improper use of `unsafe` can lead to undefined behavior or security vulnerabilities. To use `unsafe` safely, we need to carefully follow Rust's unsafe guidelines.

Here are some guidelines to follow when using the `unsafe` keyword in Rust:

1. Keep `unsafe` blocks as small as possible: Only include the minimum amount of code within an `unsafe` block that requires it.
2. Document `unsafe` code: Explain why the code requires `unsafe` and how it should be used.
3. Prefer safe abstractions: Use safe abstractions instead of creating unsafe ones from scratch.
4. Test `unsafe` code thoroughly: Test `unsafe` code as rigorously as possible to ensure its correctness.

It's important to keep these guidelines in mind when writing Rust code that uses `unsafe`. By following them, we can reduce the chances of causing undefined behavior, data races, or other issues that could compromise security.

## Unsafe Rust Library Examples

Some Rust libraries make extensive use of the `unsafe` keyword to achieve top-notch performance and provide some advanced functionality. Below are some examples of popular Rust crates that use `unsafe`.

### `libc`

The `libc` crate provides Rust bindings to the C standard library, which is used extensively in Unix environments. It exposes many unsafe features, such as raw pointers, direct memory access, and system APIs. Here's an example of using the `libc` crate to call the `gethostname` function from the C standard library:

```rust
use libc::{c_char, gethostname};

const HOSTNAME_LEN: usize = 128;

fn main() {
    let mut buffer = [0 as c_char; HOSTNAME_LEN];
    unsafe {
        let result = gethostname(buffer.as_mut_ptr(), HOSTNAME_LEN);
        if result < 0 {
            panic!("Could not retrieve hostname");
        }
    }

    let hostname = String::from_utf8_lossy(
        &buffer[..buffer.iter().position(|b| *b == 0).unwrap_or(HOSTNAME_LEN)],
    );
    println!("Hostname is: {}", hostname);
}
```

In this example, we first create a buffer for storing the hostname string, then pass a mutable pointer to the buffer to the `gethostname` function via Rust's `libc` bindings. The `unsafe` keyword is used to call `gethostname` since it involves making a system call.

### `serde`

The `serde` crate provides a framework for serializing and deserializing Rust data structures. It makes extensive use of `unsafe` and Rust's type system to provide efficient serialization and deserialization. Here's an example of using the `serde_json` module to serialize and deserialize a struct:

```rust
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
struct Person {
    name: String,
    age: u32,
}

fn main() {
    let person = Person {
        name: "Alice".to_owned(),
        age: 30,
    };

    let serialized = serde_json::to_string(&person).unwrap();
    println!("Serialized: {}", serialized);

    let deserialized: Person = serde_json::from_str(&serialized).unwrap();
    println!("Deserialized: {:?}", deserialized);
}
```

In this example, we define a `Person` struct and use the `serde` crate's `Serialize` and `Deserialize` traits to enable serialization and deserialization. The `unsafe` keyword is used under the hood for string manipulation and type casting to achieve efficiency.

## Conclusion

In conclusion, the `unsafe` keyword in Rust provides developers with the ability to write low-level code that interacts with system-level features, such as direct memory access, operating system APIs, and hardware. Although the use of `unsafe` is required in some cases, it also comes with some risks. To use `unsafe` safely, we need to carefully follow Rust's unsafe guidelines. By following these guidelines, we can reduce the chances of causing undefined behavior, data races, or other issues that could compromise security.