---
title: "Advanced Runtime Polymorphism in Rust with `dyn Trait`"
date: 2023-09-17T01:27:57.874Z
tags: ["rust","programming paradigms","object-oriented programming"]
authors: ["gpt-4"]
---


## Introduction

In systems programming, polymorphism is a powerful tool to abstract and encapsulate different behaviors under a unified interface. In Rust, the same concept can be leveraged using `dyn Trait`, which provides a pathway for runtime polymorphism -- representing different types as a single type at runtime. This blog post explores the advanced uses of `dyn Trait` in expressing runtime polymorphism in Rust.

## Understanding `dyn Trait`

In Rust, `Traits` are a way to define functionality that types can implement. Rust also allows traits to be used as types via the `dyn Trait` syntax.

```rust
trait Drawable {
    fn draw(&self);
}

struct Circle {}
struct Square {}

impl Drawable for Circle {
    fn draw(&self) {
        println!("Drawing a Circle");
    }
}

impl Drawable for Square {
    fn draw(&self) {
        println!("Drawing a Square");
    }
}

...

fn main() {
    let shapes: Vec<Box<dyn Drawable>> = vec![Box::new(Circle {}), Box::new(Square {})];
    for shape in shapes {
        shape.draw();
    }
}
```

In the code snippet above, `Drawable` is a Trait defined with a method `draw`. We then define two structs, `Circle` and `Square`, and implement the `Drawable` trait for each. Now, we can store a vector of `Drawable` trait objects — representing our differing `Circle` and `Square` types under a unified interface.

## Method Resolution

In runtime polymorphism, since the exact type of the object is not known until runtime, method resolution also happens at runtime.

```rust
trait Printable {
    fn print_type(&self);
}

struct Integer(i32);
struct Float(f32);

impl Printable for Integer {
    fn print_type(&self) {
        println!("I'm an Integer");
    }
}

impl Printable for Float {
    fn print_type(&self) {
        println!("I'm a Float");
    }
}

fn print(printable: Box<dyn Printable>) {
    printable.print_type();
}

...

fn main() {
    let my_int = Box::new(Integer(10));
    let my_float = Box::new(Float(10.0));
    print(my_int);
    print(my_float);
}
```

In the snippet above, we have a `Printable` trait implemented by `Integer` and `Float`. The concrete type wrapped in the `Box<dyn Printable>` is known only at runtime. Therefore, when `print_type` is called, Rust determines which implementation to invoke dynamically.

## Size and Performance Implications

One critical thing to recognize is that there is a certain overhead associated with runtime polymorphism. Each `Box<dyn Trait>` has an associated vtable defined at runtime. The vtable has function pointers to each trait method for the actual type. This additional indirection contributes to CPU cache misses, which can have performance implications, especially in mission-critical, high-performance systems.

## Conclusion

To sum up, runtime polymorphism with `dyn Trait` allows us to write code that is flexible and expressive. However, as with any programming tool or technique, it is essential to understand the implications — across code clarity, encapsulation, size, and performance — carefully making the tradeoffs where they make sense.