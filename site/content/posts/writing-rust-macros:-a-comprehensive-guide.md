---
title: "Writing Rust Macros: A Comprehensive Guide"
date: 2023-05-22T04:50:33.997Z
tags: ["rust","macros","procedural macros","declarative macros","programming macros","macro rules"]
---

Are you finding that your Rust code is cluttered and repetitive? Do you want to reduce boilerplate and remove errors from your code? If so, you should start writing Rust macros!

In this comprehensive guide, we'll cover everything you need to know to get started with writing Rust macros. By the end of this post, you'll have a good idea of how macros work and how to create them. Let's dive in!

## What are Macros?

Macros are a way to write code that writes code. In Rust, macros are used to generate code at compile time, which can significantly reduce boilerplate and improve code quality. Rust macros are different from C or C++ macros, which simply do text substitution.

Rust macros are split into two categories: declarative macro and procedural macro. Declarative macros are used to match against patterns and replace them with code. Procedural macros help you transform Rust code at compile time, generate code or reuse existing code with a twist.

## Writing Declarative Macros

Declarative macros are used to match against patterns and replace them with code. To define a declarative macro, you need to use the `macro_rules!` macro. Here is an example of a simple macro that prints some text:

```rust
macro_rules! say_hello {
    () => {
        println!("Hello!");
    };
}

fn main() {
    say_hello!();
}
```

In this example, we define a macro called `say_hello!`. In the macro definition, we use the `()` pattern to match an empty invocation. The macro replaces the invocation with the code `println!("Hello!");`. In the main function, we call the macro `say_hello!();`, which generates the code to print `"Hello!"`.

### Matching against Patterns

The power of declarative macros comes from the ability to match against patterns. A pattern is a fragment of code that the macro can match against. A pattern can be a literal, an ident, a repetition, or a complex structure.

Here is an example of a macro that sums two integers:

```rust
macro_rules! sum {
    ( $x:expr, $y:expr ) => {
        $x + $y
    };
}

fn main() {
    let x = 1;
    let y = 2;
    let z = sum!(x, y);
    println!("{}", z); // prints 3
}
```

In this example, we define a macro called `sum!`. The macro takes two arguments, `x` and `y`, which represent two integers. The macro replaces the invocation with the code `$x + $y;`. In the main function, we call the macro `sum!(x, y);`, and it generates code to sum two integers.

### Conditional Statements

Macros can also include conditional statements to match against multiple patterns. Here is an example of a `match` statement implemented using a macro:

```rust
macro_rules! match_expr {
    ($x:expr, $($($p:pat)|+ $(if $e:expr)? => $r:expr),+ $(,)?) => {
        match $x {
            $( $p $(if $e)? => $r, )+
            _ => {}
        }
    };
}

fn main() {
    let x = 1;
    match_expr!(x,
      1 => println!("One"),
      2 if 1 + 1 == 2 => println!("Two"),
      _ => println!("Something else"));
}
```

In this example, we define a macro called `match_expr!`. The macro takes a value `x` and one or more patterns and expressions to match against. The macro replaces the invocation with the code of a `match` statement that matches `x` against the patterns.

## Writing Procedural Macros

Procedural macros are used to transform Rust code at compile time. They're more powerful than declarative macros, but they're also more complex to write. The three types of procedural macros are: attribute macros, function-like macros, and derive macros.

### Attribute Macros

Attribute macros are used to modify a Rust module or item. An attribute macro is defined using the `proc_macro_attribute` attribute macro. Here's an example of an attribute macro that adds a debug print statement to a Rust function:

```rust
extern crate proc_macro;

use proc_macro::TokenStream;

#[proc_macro_attribute]
pub fn debug(attr: TokenStream, item: TokenStream) -> TokenStream {
    let mut fun = syn::parse_macro_input!(item as syn::ItemFn);

    let body = &fun.block;
    let inputs = &fun.decl.inputs;
    let output = &fun.decl.output;

    let name = &fun.ident;

    fun.block = syn::parse_quote! {{
        eprintln!("[DEBUG] Entering {}", stringify!(#name));
        let result = #body;
        eprintln!("[DEBUG] {} result = {:?}", stringify!(#name), result);
        result
    }};

    let res = quote::quote! {
        #fun
    };

    res.into()
}

#[debug]
fn add(a: i32, b: i32) -> i32 {
    a + b
}

fn main() {
    let a = 2;
    let b = 3;
    let c = add(a, b);
    println!("{}", c);
}
```

In this example, we define a procedural macro called `debug` using the `proc_macro_attribute` attribute macro. This macro takes a Rust function, adds a debug print statement to it, and returns the modified source code. We apply this attribute to the function `add`, which we define later in the code.

### Function-Like Macros

Function-like macros are used to generate Rust code based on the input arguments. They're defined using the `proc_macro` crate. Here's an example of a function-like macro that implements the `Option` type:

```rust
#[proc_macro]
pub fn option(input: TokenStream) -> TokenStream {
    let s = input.to_string();
    let res = quote::quote! {
        pub enum Option<T> {
            None,
            Some(T),
        }
    };
    res.into()
}

fn main() {
    let x: Option<i32> = None;
    println!("{:?}", x);
}
```

In this example, we define a function-like macro called `option` using the `proc_macro` attribute. This macro generates the code for the `Option` enum with two variants `None` and `Some`. We use this macro to generate an `Option<i32>` variable `x`, which we print.

### Derive Macros

Derive macros are used to generate Rust code based on the implementation of a trait. They're defined using the `proc_macro_derive` attribute macro. Here's an example of a derive macro that generates the implementation of the `Add` trait for a custom struct:

```rust
#[proc_macro_derive(Add)]
pub fn add_derive(input: TokenStream) -> TokenStream {
    let ast = syn::parse(input).unwrap();
    impl_add_macro(&ast)
}

fn impl_add_macro(ast: &syn::DeriveInput) -> TokenStream {
    let name = &ast.ident;
    let expanded = quote::quote! {
        impl std::ops::Add for #name {
            type Output = Self;
            fn add(self, other: Self) -> Self {
              #name { val: self.val + other.val }
            }
        }
    };
    TokenStream::from(expanded)
}

#[derive(Add)]
struct MyStruct {
    val: i32,
}

fn main() {
    let a = MyStruct { val: 2 };
    let b = MyStruct { val: 3 };
    let c = a + b;
    println!("{:?}", c);
}
```

In this example, we define a derive macro called `Add` using the `proc_macro_derive` attribute macro. This macro generates the implementation of the `Add` trait for a custom struct with a single field `val`. We use this macro to implement the `Add` trait for `MyStruct` and add two `MyStruct` instances.

## Conclusion

Macros are a powerful feature of the Rust language. They allow for the creation of complex code patterns that can be used to improve the quality, readability, and performance of your code. In this comprehensive guide, we learned about declarative and procedural macros, how to define them, and how to use them to generate Rust code. I hope you find this guide useful in your next Rust project.
