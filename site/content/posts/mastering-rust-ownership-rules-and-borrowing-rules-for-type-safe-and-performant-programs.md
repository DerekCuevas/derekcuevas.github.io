---
title: "Mastering Rust Ownership Rules and Borrowing Rules for Type-Safe and Performant Programs"
date: 2023-06-04T00:06:32.124Z
tags: ["rust","ownership","borrowing","type-safety","performance"]
---


As a systems programming language, Rust is designed to ensure both memory safety and performance. It achieves this by enforcing ownership and borrowing rules, which govern how values in memory are owned, borrowed, and used.

Ownership and borrowing rules are at the core of Rust's design and are what make Rust so powerful yet safe and efficient. In this post, we will delve into these rules and learn how to use them to write type-safe and performant programs in Rust.

## Ownership Rules

In Rust, ownership rules dictate that each value has exactly one owner at any given time, and that owner is responsible for deallocating the value when it goes out of scope. This way, Rust ensures that there are no dangling pointers or memory leaks, and all values are properly managed by the program.

Let's take a look at an example to understand the ownership rules in Rust:

```rust
fn main() {
    let s = String::from("hello");
    let s2 = s;
    println!("{}", s);
}
```

Here, we create a new `String` and bind it to the variable `s`. Then, we bind the value of `s` to a new variable `s2`. Finally, we try to print `s`. However, the Rust compiler will fail to compile this program with an error:

```
error[E0382]: borrow of moved value: `s`
 --> src/main.rs:4:20
  |
2 |     let s = String::from("hello");
  |         - move occurs because `s` has type `std::string::String`, which does not implement the `Copy` trait
3 |     let s2 = s;
  |              - value moved here
4 |     println!("{}", s);
  |                    ^ value borrowed here after move
```

The error message tells us that we're trying to use a moved value `s`, which is no longer valid after it has been moved to `s2`. So, we cannot use `s` after it has been moved to another variable.

In Rust, move semantics is used to transfer ownership from one variable to another. When a value is moved to another variable, the original variable becomes invalid and cannot be used until it's assigned a new value.

## Borrowing Rules

In Rust, borrowing rules dictate how references can be borrowed from values. References are a way to access the values without transferring ownership. By using references, Rust ensures that values remain valid while borrowed, and prevents data races and memory errors.

Let's take a look at an example to understand the borrowing rules in Rust:

```rust
fn main() {
    let s = String::from("hello");
    let len = calculate_length(&s);
    println!("The length of '{}' is {}.", s, len);
}

fn calculate_length(s: &String) -> usize {
    s.len()
}
```

Here, we define a function `calculate_length` that takes a reference to a string `&String` as an argument. Then, we pass a reference to `s` to `calculate_length`. Finally, we print the length of `s`.

The key aspect of this example is that we're borrowing a reference to `s` instead of moving it. By borrowing a reference, we're not transferring ownership of `s`, and we're only allowing `calculate_length` to access it.

In Rust, there are two kinds of references: immutable references `&T` and mutable references `&mut T`. Immutable references allow for read-only access to the value, while mutable references allow for read and write access to the value.

The borrowing rules in Rust essentially state that you cannot have both mutable references and immutable references to the same value at the same time, and that you must ensure that references are valid for as long as they are used.

## Conclusion

In this post, we learned about Rust's ownership rules and borrowing rules, which govern how values in memory are owned, borrowed, and used. By following these rules, Rust ensures that programs are type-safe and performant, and that memory errors are prevented.

Rust's unique approach to ownership and borrowing may seem daunting at first, but it's what makes Rust so powerful and different from other programming languages. By mastering these rules, you'll be able to write code in Rust that's safe, efficient, and elegant.