---
title: "Building High-Performance, Real-time Video Streaming Systems with Rust, Tokio, and WebSockets"
date: 2023-05-27T06:03:13.065Z
tags: ["rust","tokio","websockets"]
---


Real-time video streaming systems require highly reliable and fast communication between clients and servers, and Rust and Tokio are two technologies that offer the necessary performance to build such systems. In this post, we will explore how to build a high-performance, real-time video streaming system with Rust, Tokio, and WebSockets.

## Setting up the project

First, let's create a new Rust project and add the dependencies we'll need.

```bash
$ cargo new video_streaming
$ cd video_streaming
```

Add the following dependencies to your `Cargo.toml` file:

```toml
[dependencies]
tokio = { version = "1.1", features = ["full"] }
websocket = "0.23.1"
```

We will use the `tokio` library for asynchronous I/O operations, and the `websocket` library for real-time communication with clients.

## Implementing the server

Now we can implement the server. In a new file named `server.rs`, add the following code:

```rust
use std::collections::HashMap;
use std::sync::Arc;

use tokio::sync::{mpsc, Mutex};
use tokio::time::{interval_at, Duration, Instant};
use tokio::net::TcpListener;
use tokio::stream::StreamExt;

use websocket::{OwnedMessage, WebSocket};
use websocket::server::InvalidConnection;

#[tokio::main]
async fn main() {
    let addr = "127.0.0.1:8080";

    let listener = TcpListener::bind(addr).await.unwrap();
    println!("Listening on: {}", addr);

    let state = Arc::new(Mutex::new(State {
        clients: HashMap::new(),
        video_data: vec![],
        frame_rate: 30,
    }));

    let state1 = state.clone();
    let (tx, mut rx) = mpsc::channel(1024);

    tokio::spawn(async move {
        let mut interval = interval_at(Instant::now(), Duration::from_millis(33));
        loop {
            interval.tick().await;
            let frame_duration = Duration::from_secs(1) / state1.lock().await.frame_rate as u32;
            let mut state = state1.lock().await;

            while state.video_data.len() > (state.frame_rate * 5) as usize {
                state.video_data.remove(0);
            }

            let frame = state.video_data.pop();

            if let Some(frame) = frame {
                let message = OwnedMessage::Binary(frame);
                for tx in state.clients.values() {
                    if let Err(e) = tx.send(message.clone()).await {
                        println!("Error sending message: {}", e);
                    }
                }
            }

            state.frame_rate = rx.try_recv().unwrap_or(state.frame_rate);
        }
    });

    while let Ok((stream, addr)) = listener.accept().await {
        let state = state.clone();
        tokio::spawn(async move {
            if let Err(e) = handle_connection(stream, addr, state).await {
                println!("Error: {}", e);
            }
        });
    }
}

async fn handle_connection(stream: tokio::net::TcpStream, addr: std::net::SocketAddr, state: Arc<Mutex<State>>) -> Result<(), InvalidConnection> {
    let ws = WebSocket::new(stream);
    let (mut socket, mut sender) = ws.accept().await?;

    println!("Connected client: {}", addr);

    let (tx, mut rx) = mpsc::channel(1024);
    let client_id = addr.to_string();
    state.lock().await.clients.insert(client_id.clone(), tx);

    while let Some(Ok(message)) = socket.next().await {
        match message {
            OwnedMessage::Binary(data) => {
                state.lock().await.video_data.push(data);
            }
            OwnedMessage::Close(_) => {
                break;
            }
            _ => {}
        }
    }

    state.lock().await.clients.remove(&client_id);
    Ok(())
}

#[derive(Debug)]
struct State {
    clients: HashMap<String, mpsc::Sender<OwnedMessage>>,
    video_data: Vec<Vec<u8>>,
    frame_rate: u32,
}
```

The server uses `tokio::net::TcpListener` to listen for incoming connections on Port 8080. It obtains a lock on the server `State`, which holds information about the connected clients, the video data, and the frame rate. The server then spawns a Tokio task to stream video data to clients. It accepts connections in a loop and handles them using the `handle_connection` function. The `handle_connection` function receives messages from the client and adds them to the video data buffer. When a client disconnects, it removes it from the clients list.

## Implementing the client

Now let's implement a Rust client that connects to the server and streams video data. In a new file named `client.rs`, add the following code:

```rust
use std::io::{self, Read};
use std::net::TcpStream;
use std::thread;

use websocket::{OwnedMessage, WebSocket};

fn main() -> io::Result<()> {
    let args: Vec<String> = std::env::args().collect();
    let addr = &args[1];

    let mut stream = TcpStream::connect(addr)?;
    stream.set_nonblocking(true)?;

    let mut ws = WebSocket::new(stream);
    ws.connect().unwrap();

    loop {
        let mut buf = vec![0u8; 4096];
        match ws.recv_message() {
            Ok(OwnedMessage::Binary(data)) => {
                // Process video data
            }
            Ok(m) => println!("Received: {:?}", m),
            Err(e) => {
                println!("Error: {}", e);
                break;
            }
        }
    }

    Ok(())
}
```

The client connects to the server and uses a loop to receive binary data messages from the server. The binary data represents video frames, which can be processed by the client to display the video stream.

## Conclusion

In this post, we built a high-performance, real-time video streaming system using Rust, Tokio, and WebSockets. The server handles incoming connections and streams video data to clients, while the client connects to the server and displays the video stream. With Rust and Tokio, we can create fast and reliable real-time video streaming systems.