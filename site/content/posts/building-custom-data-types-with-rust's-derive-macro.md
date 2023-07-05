---
title: "Building Custom Data Types with Rust's derive Macro"
date: 2023-07-05T12:03:06.711Z
tags: ["rust","programming"]
authors: ["gpt-3.5-turbo-0301"]
---


Rust is a unique programming language with some remarkable features. Besides its memory safety guarantee, expressive syntax and performance, Rust seems to fit best for building systems-level software.

Among the most helpful Rust macros, `derive` is a keyword that can reduce boilerplate in implementations of commonly used traits. This makes it an excellent way to encode data types that conform to a specific pattern.

In this post, we'll explore how to build custom data types using Rust's `derive` macro.

## What is a Derive Macro?

A derive macro is a Rust macro that allows for the automatic generation of code implementing common Rust traits and interfaces. These derive macros have access to the AST of the item (struct, enum, union etc.) being derived, and can generate implementation code based on that information.

Rust includes support for several built-in derive macros:

- `Clone`: creates a new instance of a struct that is a copy of an existing instance.
- `Copy`: a struct that can be safely bit-copied, allowing for values to be easily moved around in memory.
- `Debug`: formats a struct or enum in a way that is readable to humans and commonly used for debugging purposes.
- `PartialEq`, `Eq`: checks whether one instance of a struct is equal to another.
- `PartialOrd`, `Ord`: checks whether one instance is greater than, less than, or equal to another.
- `Default`: returns a default instance of a struct.
- `Hash`: creates a unique identifier for a struct, useful for hashing algorithms like those used in HashMap.
- `Serialize`, `Deserialize`: encodes a struct or enum to or from a byte sequence.

## Steps to Create Custom Data Types

Custom data types can be created in Rust by declaring a struct or enum. Rust's `derive` macro makes it possible to derive implementation code for these custom data types easily. Here's how to create custom data types in Rust:

### 1. Define the custom data types

Defining custom structs in Rust is similar to defining a class or an object in other languages. Here we define a simple `Circle` struct with float type for radius.

```rust
struct Circle {
    radius: f32,
}
```

### 2. Implement the custom traits for the defined data type using the derive macro.

To implement a trait for our custom data type, we use the `#[derive(trait_name)]` annotation. The `Clone` example would look like this:

```rust
#[derive(Clone)]
struct Circle {
    radius: f32,
}
```

If we need to derive multiple traits, we can separate them with commas:

```rust
#[derive(Clone, Debug, PartialEq)]
struct Circle {
    radius: f32,
}
```

### 3. Generate code based on the defined data type

Once the traits are defined using `derive` , Rust will automatically generate implementations for the traits.

For example, if we were to use the clone implementation we defined earlier:

```rust
let circle_1 = Circle { radius: 3.0 };
let circle_2 = circle_1.clone();
```

This will create a copy of `circle_1` into `circle_2`.

```rust
println!("{:?}", circle_2);
```

This will print the debug view of `circle_2`.

## Custom Derive Macros

So far, we've only looked at the built-in traits supported by Rust's `derive` macro. However, we are not limited to these built-in traits.

We can create custom traits and implement them using custom derive macros. These custom derive macros are created using a procedural macro crate called `proc-macro2`. This crate allows the creation of custom procedures for creating new syntactic constructs that can be used everywhere in Rust code.

Here is a simple example of a custom derive macro to calculate the area of a circle based on its radius:

```rust
use proc_macro::TokenStream;
use quote::quote;
use syn::{parse_macro_input, DeriveInput};

#[proc_macro_derive(Area)]
pub fn area(input: TokenStream) -> TokenStream {
    let ast = parse_macro_input!(input as DeriveInput);
    let name = &ast.ident;
    let gen = quote! {
        impl #name {
            pub fn area(&self) -> f64 {
                self.radius * self.radius * std::f64::consts::PI
            }
        }
    };
    gen.into()
}
```

This macro can now be used to derive an area method for the `Circle` struct:

```rust
#[derive(Area)]
struct Circle {
    radius: f64,
}
```

And the `area` method can be accessed using:

```rust
let circle = Circle { radius: 2.0 };
println!("The area of the circle is {}", circle.area());
```

This will print the area of the `Circle` object.

## Conclusion

In conclusion, we've looked at creating custom data types in Rust and how to use Rust's `derive` macro to automatically generate implementation code for commonly used Rust traits. We also explored how we can create our custom traits and implement them with custom derive macros using a procedural macro crate called `proc-macro2`.

The ability to derive traits for our custom data types helps eliminate boilerplate code and enables us to focus on what's essential: implementing the functionality we need. With Rust, we have limitless possibilities for creating custom data types and derive macros.