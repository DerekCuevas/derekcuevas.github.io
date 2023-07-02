---
title: "How to Build High-Availability WebSocket Services with Rust and Actix-Web"
date: 2023-05-31T12:03:45.566Z
tags: ["rust","actix-web","websockets"]
authors: ["gpt-3.5-turbo-0301"]
---


Real-time communication is increasingly becoming more important in modern web applications. As a result, WebSocket, a protocol that provides full-duplex communication with a server over a single TCP connection has become a popular choice for building real-time web applications. WebSocket is the backbone of many real-time communication apps such as chat systems, push notifications, and online gaming.

In this post, we'll discuss how to build high-availability WebSocket Services with Rust and Actix-Web, a powerful web framework for Rust. By taking advantage of Rust's ownership model, threading strategy, and Actix's asynchronous processing capabilities, we'll be able to build a performant and reliable WebSocket service.

### Prerequisites

Before we begin, make sure you have the latest version of Rust installed on your system. You can verify this by running:

```rust
$ rustc --version
```

You should have at least version 1.55.0 or higher. If you don't have Rust installed, you can get it from the official Rust website [rust-lang.org](https://www.rust-lang.org/tools/install).

### Creating a New Actix-Web Project

We'll begin by creating a new Actix-Web project using cargo, Rust's package manager. Open up the command line and navigate to the directory where you want to store your project.

```rust
$ cargo new --bin actix_websocket
```

This command creates a new binary project named `actix_websocket`.

Next, add the Actix-Web dependency to your project by modifying the `Cargo.toml` file to include the following lines:

```rust
[dependencies]
actix-web = "4"
actix-rt = "2"
```

### Implementing the WebSocket Service

To implement a WebSocket service in Actix-Web, we need to create a new WebSocket handler and a WebSocket actor. The WebSocket actor will be responsible for handling incoming and outgoing WebSocket messages, while the WebSocket handler will manage the connection between the WebSocket client and the WebSocket actor.

#### WebSocket Actor

Let's start by creating a new WebSocket actor. An actor is a concurrent object that receives messages and processes them. In Actix-Web, an actor is implemented using the `actix::Actor` trait. 

Here's an example of a simple WebSocket actor:

```rust
use actix::{Actor, StreamHandler, Context};
use actix_web_actors::ws;

struct MyWebSocketActor;

impl Actor for MyWebSocketActor {
    type Context = ws::WebsocketContext<Self>;

    fn started(&mut self, ctx: &mut Self::Context) {
        println!("WebSocket connection established");
    }
}

impl StreamHandler<Result<ws::Message, ws::ProtocolError>> for MyWebSocketActor {
    fn handle(&mut self, msg: Result<ws::Message, ws::ProtocolError>, ctx: &mut Self::Context) {
        match msg {
            Ok(ws::Message::Ping(msg)) => {
                ctx.pong(&msg);
            }
            Ok(ws::Message::Text(text)) => {
                ctx.text(text);
            }
            Ok(ws::Message::Binary(bin)) => {
                ctx.binary(bin);
            }
            Ok(ws::Message::Close(reason)) => {
                ctx.close(reason);
                ctx.stop();
            }
            Err(e) => {
                println!("Error: {:?}", e);
                ctx.stop();
            }
            _ => (),
        }
    }
}
```

In this code, we define a new struct `MyWebSocketActor` that implements the `actix::Actor` and `actix_web::StreamHandler` traits. The `Actor` trait requires a type definition of `Context`, which is the `actix_web::WebsocketContext<Self>` type in this case.

In the `started` method, we print a message to the console to confirm that a WebSocket connection has been established.

In the `StreamHandler` trait, we match on the incoming WebSocket message types (`Ping`, `Text`, `Binary`, and `Close`). For each message type, we call the appropriate function on the WebSocket context to respond accordingly.


#### WebSocket Handler

Now that we have our WebSocket actor implementation, let's create a WebSocket handler that will accept WebSocket connections, manage the connection, and route messages to the WebSocket actor.

```rust
async fn ws_handler(req: HttpRequest, stream: web::Payload) -> Result<HttpResponse, Error> {
    let res = ws::start(MyWebSocketActor {}, &req, stream);

    match res {
        Ok(ws) => ws,
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}
```

In this code, we define an `async` function `ws_handler` that takes an `HttpRequest` object and an `actix_web::web::Payload` object as parameters. The `Payload` is a `Stream` of data bytes that represent the WebSocket message content.

Inside `ws_handler`, we initiate a new WebSocket connection by calling the `ws::start` function and passing in a new instance of `MyWebSocketActor` along with the `HttpRequest` object and the `Payload` stream. If the connection is successful, the `ws` object is returned. Otherwise, we'll return an Internal Server Error response.

### Putting It All Together

Now we have both our WebSocket actor and WebSocket handler implemented, and we can put them together in the main function of our Rust program:

```rust
#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let port = 8000;
    println!("Starting WebSocket server at port {}", port);
    HttpServer::new(|| {
        App::new()
            .service(web::resource("/ws/").to(ws_handler))
    })
    .bind(("127.0.0.1", port))?
    .run()
    .await
}
```

In the main function, we set the port number to listen for WebSocket connections on. We then pass in our `ws_handler` function to the `web::resource` method to map to the `/ws/` endpoint. Finally, we bind and run the server using the `HttpServer` object.

### Conclusion

Actix-Web provides a powerful, yet simple-to-use platform for implementing WebSocket services in Rust. By taking advantage of Rust's ownership model, threading strategy, and Actix's asynchronous processing capabilities, we can build high-performance, reliable, and robust WebSocket services that meet the needs of modern web applications. In this post, we've covered the basics of creating a WebSocket service using Actix-Web, but this is just the beginning. With Actix-Web and Rust, the possibilities are endless.