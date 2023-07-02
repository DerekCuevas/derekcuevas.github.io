---
title: "Weird Rust Features"
date: 2023-05-29T02:36:26.714Z
tags: ["rust","programming","advanced"]
authors: ["gpt-3.5-turbo-0301"]
---


Rust is well known for its memory-safe features, speed, concurrency, and structural readability. However, there are some features in Rust that are lesser known and can seem weird to inexperienced Rustaceans. In this article, we will explore some of these features and their use cases.

## 1. Raw Pointers

Raw pointers in Rust are pointers that are not forced to follow all the borrowing rules, unlike references, which must obey the borrowing rules. Raw pointers can be dereferenced without the borrow checker's permission and are marked with an asterisk followed by the const or mut keywords. Raw pointers to mut data are considered unsafe and cannot be aliased.

Here's an example of creating and dereferencing a raw pointer:

```rust
let mut num = 5;
let ptr = &num as *const i32;

unsafe {
    println!("Value of num is: {}", *ptr);
}
```

In the above example, we created a raw pointer `ptr` to the `num` variable and dereferenced it using the `*` operator inside an `unsafe` block. The program prints `Value of num is: 5`.

Raw pointers come in two flavors: `*const T` and `*mut T`, where `T` is the type of value the pointer points to.

## 2. Keyword Paths

Rust provides a unique feature where we can use keywords as path components. Using keyword paths gives us access to otherwise hidden functions, for example, to use a function that is overridden by a local definition, without having to use a fully qualified name.

The special syntax for using a keyword path component is to prefix the component with `r#`. Here's an example:

```rust
fn r#match() {
    println!("This is not a match expression");
}

fn main() {
    r#match();
}
```

In the above example, we defined a function called `match` using the `r#match` syntax to use a Rust keyword. We are then able to call this function using the `r#match()` syntax.

## 3. Dynamically Sized Types

Dynamically sized types (DSTs) are types whose size is unknown at compile time, and allocate memory on the heap. In Rust, DSTs are only allowed behind a pointer or a reference. This means that the bare DST would be unallocated and have no size. 

An example of a dynamically sized type in Rust is a slice of `str` values. The size of a slice is not known at compile-time.

Here’s an example of using a slice with dynamically sized types:

```rust
let str_slice: &[str] = &["Learn", "Rust"];
println!("The slice has a length of {}.", str_slice.len());
```

In the above example, we defined a slice of `str` that is determined at runtime, and accessed its length with the `len()` method. 

## Conclusion

Rust’s feature set is expansive, and it’s not uncommon for developers to discover new features years after they first started using the language. In this article, we looked at some of the more peculiar Rust features. Raw pointers, keyword paths, and dynamically sized types represent powerful capabilities that Rust offers its users. By being aware of these features and how to use them safely, Rust programmers can take full advantage of the language's capabilities.