---
title: "Building a Fast and Scalable HTTP Server with Rust's Actix-Web Library"
date: 2023-05-27T00:05:26.377Z
tags: ["rust","actix-web","http","server","performance","scalability"]
authors: ["gpt-3.5-turbo-0301"]
---


Rust is known for its performance, memory safety, and strong typing features. In addition, the language is ideal for building high-performance web applications and services. Actix-web is a popular Rust library that allows developers to easily build both HTTP and WebSocket servers.

In this post, we will explore Actix-web and build a fast and scalable HTTP server. We will cover the following topics:

1. Setting up the project
2. Creating and configuring the server
3. Defining routes and handlers
4. Implementing middleware for logging and error handling
5. Performance testing

## Setting up the project

The first step is to create a new Rust project. Let's use Cargo, Rust's package manager, to set up the project. Open a terminal and run the following commands:

```bash
$ cargo new actix-server
$ cd actix-server
```

This will create a new Rust project named "actix-server" and change the working directory to the project's root.

## Creating and configuring the server

Next, let's add the Actix-web dependency to the project. Open the "Cargo.toml" file and add the following line to the dependencies section:

```toml
[dependencies]
actix-web = "3.3.2"
```

Save the file and run the following command to download and build the dependency:

```bash
$ cargo build
```

After the build is successful, we can start implementing the server. Create a new file named "main.rs" in the src directory. The first thing we need to do is to import the required modules:

```rust
use actix_web::{middleware, web, App, HttpServer, Result};
```

Then, we define a function that will handle the GET request for the root path:

```rust
async fn index() -> Result<HttpResponse> {
    Ok(HttpResponse::Ok().body("Hello, Rust!"))
}
```

The "index" function returns a "Result" that contains an HTTP response. In this case, it returns an HTTP 200 response with a simple "Hello, Rust!" message.

Next, we create a new HTTP server using the "HttpServer" struct. We can configure the server by calling the "bind" method and passing the server address as an argument:

```rust
let server = HttpServer::new(|| App::new().route("/", web::get().to(index)))
    .bind("127.0.0.1:8080")?;
```

The "new" method creates a new HttpServer instance with a closure that constructs a new Actix-web application instance. The application instance is then configured with a single route that maps the root path to the "index" function.

Finally, we use the "bind" method to bind the server to the address "127.0.0.1:8080". The bind method returns a "Result" that we need to unwrap or handle gracefully.

Now, we can start the server by calling the "run" method:

```rust
server.run().await?;
```

## Defining routes and handlers

Let's add more routes to our server. We can define a new function for each route. In this example, we will add a route that accepts a name as a parameter and returns a personalized greeting:

```rust
async fn greet(info: web::Path<(String,)>) -> Result<HttpResponse> {
    let name = &info.0;
    let greeting = format!("Hello, {}!", name);

    Ok(HttpResponse::Ok().body(greeting))
}
```

We modified the function signature to accept a single parameter of type "web::Path". The parameter contains a tuple with one element of type "String". The value of this parameter is the name passed in the request path.

We also use the "format" macro to create a personalized greeting message, and return it as an HTTP response.

We can add the new route to the Actix-web application instance by chaining the route method:

```rust
let server = HttpServer::new(|| {
    App::new()
        .wrap(middleware::Logger::default())
        .route("/", web::get().to(index))
        .route("/greet/{name}", web::get().to(greet))
})
.bind("127.0.0.1:8080")?;
```

We chained the "route" method again to add a new route that maps to the "greet" function. The route contains a parameter placeholder named "name", which will match any non-empty string.

## Implementing middleware for logging and error handling

We can add middleware to the Actix-web application instance to implement additional functionality, such as logging and error handling. In this example, we will add a Logger middleware that logs request and response information to the console.

First, add the following line to the dependencies section of the "Cargo.toml" file:

```toml
env_logger = "0.9.0"
```

This will allow us to use the env_logger library to implement logging.

Next, import the env_logger and use it to initialize the logger:

```rust
use std::env;
use env_logger::Env;

fn main() -> std::io::Result<()> {
    env::set_var("RUST_LOG", "actix_web=info");
    env_logger::Builder::from_env(Env::default().default_filter_or("info")).init();

    let server = HttpServer::new(|| {
        App::new()
            .wrap(middleware::Logger::default())
            .route("/", web::get().to(index))
            .route("/greet/{name}", web::get().to(greet))
    })
    .bind("127.0.0.1:8080")?;

    server.run()
}
```

We set the "RUST_LOG" environment variable to "actix_web=info" to enable logging for the Actix-web library.

We also configure env_logger using its builder API with a default filter of "info". We then initialize the logger by calling the "init" method.

The Logger middleware is already added to the Actix-web application instance. It will log each request and response to the console in the following format:

```
INFO [actix_web::middleware::logger] 127.0.0.1:55358 "GET / HTTP/1.1" 200 13 "-" "curl/7.64.1" 0.000379
```

## Performance testing

We have implemented a fast and scalable HTTP server with Actix-web. Let's test its performance using the wrk benchmarking tool. Install wrk using the following command:

```bash
$ brew install wrk
```

Then, start the server by running the following command:

```bash
$ cargo run
```

Finally, in another terminal window, run the wrk benchmark test:

```bash
$ wrk -t4 -c100 -d30s http://localhost:8080/
```

This will run the benchmark with 4 threads, 100 connections, and a duration of 30 seconds.

The final result will show the summary table with the requests per second, latency, and transfer rate. The result should show a high number of requests per second and a low latency, which indicates a fast and scalable server.

## Conclusion

In this post, we explored the Actix-web library and how to build a fast and scalable HTTP server with Rust. We created and configured the server, defined routes and handlers, and implemented middleware for logging and error handling. Finally, we tested the server's performance using the wrk benchmarking tool.