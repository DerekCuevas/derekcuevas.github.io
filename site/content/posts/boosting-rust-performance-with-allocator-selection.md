---
title: "Boosting Rust Performance with Allocator Selection"
date: 2023-06-12T00:14:48.020Z
tags: ["rust","performance","memory allocation"]
---



Rust is a systems programming language that values performance and efficiency. One of the key aspects of performance in Rust is memory allocation, which can sometimes be a bottleneck for application speed. Choosing the right allocator implementation for a program can greatly improve its performance.

In this post, we’ll cover how to select and configure allocators in Rust for optimal performance.

## Understanding Rust’s Allocators

In Rust, allocations occur when you create an object on the heap. By default, Rust uses the jemalloc allocator for running Rust programs. jemalloc provides the fastest and most efficient memory allocation for Rust. However, if you want to further optimize the memory allocation in Rust, you can choose other allocator implementations.

Rust has several built-in allocator implementations, including `system`, `wee_alloc`, and `jemalloc`. Additionally, Rust allows third-party allocators by using crates such as `mimalloc` and `tcmalloc` that provide performance advantages in specific use cases.

Let's take a look at the built-in allocator implementations and their usage.

### System Allocator

Rust’s `system` allocator is the default allocator implementation. It is a thin wrapper around the underlying system allocator. This allocator is used when no other allocator is provided. It's not the most performant allocator for most use cases but it is a good fit for small programs.

### Wee Allocator

Rust’s `wee_alloc` allocator implementation is minimal and very small in size. It is the smallest possible allocator implementation, and its main use case is for applications with small footprint.

### Jemalloc Allocator

Rust’s `jemalloc` allocator implementation is the fastest and most efficient allocator implementation. It's also the default allocator implementation for Rust. It can be used in almost all use cases and provides excellent speed and fragmentation when handling large memory allocations.

By choosing jemalloc, it is possible to reduce memory fragmentation and improve performance, particularly in cases where a program makes many small allocations and deallocations. It is easy to use and requires minimal configuration since it is already included in the Rust standard library.

## Using Third-Party Allocators in Rust

While Rust’s built-in allocators are powerful, there are also many third-party allocator crates that are optimized for specific use cases. These crates provide functionality beyond the built-ins, with performance optimizations tailored to your program's needs, resulting in improved performance.

Two widely-used third-party allocators are `mimalloc` and `tcmalloc`.

### Mimalloc

`mimalloc` is a memory allocator that was originally developed for use with the Zig programming language. However, since Rust is also a systems programming language, it is a good fit for Rust as well. `mimalloc` is highly optimized for multi-threaded workloads and large memory allocations.

To use `mimalloc` with Rust, add the following line to your `Cargo.toml` file:

```toml
[dependencies]
mimalloc = "0.1"
```

Then, add the following lines to your Rust program:

```rust
#[global_allocator]
static GLOBAL: mimalloc::MiMalloc = mimalloc::MiMalloc;
```

By doing so, you’ve instructed Rust to use the `mimalloc` allocator for all memory allocations.

### Tcmalloc

`tcmalloc` is another high-performance allocator, originally developed by Google and used extensively in Google projects. It provides excellent performance in high-throughput and multi-threaded workloads, as well as in large memory allocations. `tcmalloc` is perfect for programs that consist of long-running processes and that require high-performance and low memory fragmentation.

To use `tcmalloc` with Rust, add the following line to your `Cargo.toml` file:

```toml
[dependencies]
tcmalloc = "0.1"
```

Then, add the following lines to your Rust program:

```rust
#[global_allocator]
static GLOBAL: tcmalloc::TCMalloc = tcmalloc::TCMalloc;
```

By doing so, you’ve instructed Rust to use the `tcmalloc` allocator for all memory allocations.

## Conclusion

By selecting the right allocator implementation and its corresponding configuration, we can greatly improve the memory allocation performance of our Rust programs. It is often worthwhile to evaluate and compare different allocator implementations and their performance characteristics to determine the ideal configuration for our program.

Additionally, Rust allows for easy management of allocators using `#[global_allocator]` and choosing third-party allocators using Cargo. These facilites in Rust give us great flexibility in choosing the best allocator implementation for our needs.