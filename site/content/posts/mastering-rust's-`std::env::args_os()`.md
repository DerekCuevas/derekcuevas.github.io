---
title: "Mastering Rust's `std::env::args_os()`"
date: 2023-06-03T06:03:05.985Z
tags: ["rust","command-line interface","cli"]
---


Have you ever used the `args` function in Rust to parse command-line arguments? If so, you might be interested in its counterpart, `args_os`, which exposes the program's arguments as a collection of `OsString`s instead of `String`s. In this post, we will dive deep into Rust's `std::env::args_os` function and explore why, how, and when you should use it.

## Overview

The `args_os` function returns an iterator over the command-line arguments available to a Rust program. Unlike its `args` counterpart, it provides the list of arguments as a collection of `OsString` values, which represent platform-specific, arbitrary byte sequences, rather than `String` values.

```rust
use std::env;

fn main() {
    let args_os: Vec<_> = env::args_os().collect();
    println!("{:?}", args_os);
}
```

Running this example with the command-line input `rust program.rs --flag` would output `["rust", "program.rs", "--flag"]` on most platforms.

## Advantages

Using `args_os` instead of `args` provides several advantages in command-line interface (CLI) applications.

Firstly, it ensures that arguments containing invalid Unicode sequences or sequences incompatible with the current platform's character encoding do not cause a panic, which can occur when passing invalid UTF-8 data to `String`. Instead, it may be desirable to handle encoding errors by replacing the invalid bytes with a fallback or ignoring them entirely.

```rust
use std::env;
use std::ffi::{OsStr, OsString};
use std::os::unix::ffi::{OsStrExt, OsStringExt};

fn main() {
    let invalid_arg = OsString::from_vec(vec![0xff]);
    let args_os: Vec<_> = env::args_os()
        .map(|arg| {
            arg.encode_wide()
                .filter(|&ch| ch <= 0x7f)
                .map(|ch| ch as u8)
                .chain(std::iter::once(0))
                .collect::<Vec<_>>()
        })
        .map(|arg| OsString::from_vec(arg))
        .chain(std::iter::once(invalid_arg))
        .collect();
    println!("{:?}", args_os);
}
```

This program replaces any non-ASCII byte with a question mark, converting `"Rücksendung"` into `"R?cksendung"`, for example. It also adds an invalid argument consisting of the invalid byte `0xff` to demonstrate that `args_os` does not panic when encountering non-UTF-8 sequences.

Secondly, it enables you to retain the original byte sequence of the argument, which is useful when working with filenames, environment variables, system-specific flags, and other non-Unicode data.

```rust
use std::env;
use std::ffi::{OsStr, OsString};
use std::os::unix::ffi::OsStrExt;

fn main() {
    let args_os: Vec<_> = env::args_os()
        .map(|arg| {
            arg.as_bytes()
                .iter()
                .filter(|&&ch| ch != b' ')
                .map(|&ch| ch)
                .collect::<Vec<_>>()
        })
        .map(|arg| OsString::from_vec(arg))
        .collect();
    println!("{:?}", args_os);
}
```

This program removes every space character of the input arguments and prints the result without converting the byte sequence to a `String`, ensuring that non-ASCII, non-UTF-8 characters are preserved.

Finally, it enables you to preserve any zero bytes in the input, which are otherwise treated as a null terminator when converted to `String`.

```rust
use std::env;
use std::ffi::OsString;
use std::os::unix::ffi::OsStringExt;

fn main() {
    let args_os: Vec<_> = env::args_os()
        .map(|arg| {
            let mut os_string = arg.into_os_string();
            os_string.push("\0");
            os_string
        })
        .collect();
    println!("{:?}", args_os);
}
```

This program appends a null byte to each input argument, ensuring that zero bytes are preserved in the output.

## Conclusion

In this post, we have explored the `std::env::args_os` function in Rust, which provides access to the command-line arguments of a program as collations of `OsString` values, preserving non-ASCII, non-UTF-8, and zero bytes in the input. We have demonstrated how this function can be used to handle invalid Unicode sequences, work with non-Unicode data, and preserve zero bytes. Whether you are building a CLI application, working with filenames, or dealing with platform-specific flags, `args_os` is a powerful tool to have at your disposal.