---
title: "Building High-Performance Web Apps with Rust and WebGPU"
date: 2023-05-23T18:02:00.346Z
tags: []
---
Tags: Rust, WebGPU, Web development

# Introduction

Web Assembly and Rust have become very popular among web developers to develop high-performance applications like video streaming, games, and other computationally intensive tasks. However, Rust comes with very little in-built libraries for web development. In this blog post, we explore a new technology called WebGPU in combination with Rust to build high-performance web applications.

# What is WebGPU?

WebGPU is a new emerging standard for low-level graphics and compute on the web. It is a graphics API that brings the power of modern desktop graphics to the web. It is faster than WebGL and has a simplified programming model. WebGPU is built on top of the underlying hardware acceleration and works on both desktop and mobile devices.

# Building WebGPU apps with Rust

Traditionally, JavaScript was used for web development, but it has limitations in terms of performance and power. Rust is a systems programming language that can be paired with WebAssembly to unlock high performance and low-level control, with features like zero-cost abstractions, low-level memory management, and a focus on performance and safety.

WebGPU is still a very new technology and bindings for Rust are not yet available via the standard WebIDL-based WebGPU API. But there is a Rust library called `wgpu` available on GitHub that provides a Rust-native API for working with WebGPU.

Here is a code sample that shows how to use `wgpu` to create and render a triangle:

```rust
use wgpu::{BufferUsage, Color, Device, Queue, RenderPass, SwapChain};
use winit::{event::Event, event_loop::ControlFlow, event_loop::EventLoop, window::Window};

async fn run() -> Result<(), WebGpuError> {
    // setup code
    # Ok(())
}

fn main() {
    env_logger::init();
    let event_loop = EventLoop::new();
    let window = Window::new(&event_loop)?;
    let instance = wgpu::Instance::new(wgpu::BackendBit::PRIMARY);
    // ...
    let mut state = futures::executor::block_on(setup(&window, &instance))?;
    event_loop.run(move |event, _, control_flow| {
        *control_flow = ControlFlow::Poll;
        match event {
            Event::RedrawRequested(_) => {
                // rendering code
            }
            Event::MainEventsCleared => {
                window.request_redraw();
            }
            Event::WindowEvent { event, .. } => match event {
                ...
            }
            _ => {}
        }
    });
}
```

# Setting up a Rust and WebGPU project

To start off, we need to set up our environment. We need to have Rust installed along with the `wasm-pack` crate and WebGPU compatible hardware or a good emulator.

Secondly, we need to create a new Rust package with the following command:

```
cargo new --lib my-wgpu-project
```

To compile our project to WebAssembly, we need to install `wasm-pack`, which is a Rust tool that compiles our Rust code to a wasm module and packages it as an npm package. To install:

```
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
```

With `wasm-pack` installed and initialized, just run:

```
cd my-wgpu-project
wasm-pack init --scope <npm-username>
```

# Conclusion
