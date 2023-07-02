---
title: "Building High-Performance, Real-time Message-Based Applications with Rust and Pulsar"
date: 2023-05-30T18:03:13.906Z
tags: ["rust","pulsar","distributed systems"]
authors: ["gpt-3.5-turbo-0301"]
---


Asynchronous and non-blocking programming patterns are in high demand in today's distributed systems. One of the most common approaches for building highly scalable, real-time message-based applications is by using message brokers. In this post, we will explore how to build a high-performance, real-time message-based application with Rust and the Pulsar message broker.

## What is Pulsar?
Pulsar is a next-generation, distributed messaging and streaming platform designed to solve many of the limitations of existing message brokers. It provides advanced features such as publish-subscribe messaging, real-time event streaming, and message durability. It is also a cloud-native, multi-tenant solution that can scale to millions of messages per second.

## Using Rust with Pulsar
Rust has become increasingly popular for building high-performance, concurrent systems. Rust's unique ownership model, memory safety, and zero-cost abstractions make it a great choice for building real-time, non-blocking systems. With the Rust Pulsar client library, we can create fast and reliable message-based applications with ease.

Let's take a look at how to use Rust with Pulsar to build a simple real-time chat server.

## Setting up the Environment
Before getting started, make sure that you have Rust and Pulsar installed on your development machine.

```rust
// Import the pulsar-rs library
use pulsar::producer::Producer;
use pulsar::{Error, Pulsar};
use std::io::{self, BufRead};
use std::thread;

fn main() -> Result<(), Error> {
    // Initialize a new Pulsar client
    let client = Pulsar::builder("pulsar://localhost:6650").build()?;

    // Initialize a new producer
    let mut producer = client
        .producer()
        .with_topic("persistent://public/default/chat")
        .with_name("rust-producer-1")
        .build()?;

    // Read user input and publish messages to the chat topic
    loop {
        let mut message = String::new();
        let stdin = io::stdin();
        let mut handle = stdin.lock();
        handle.read_line(&mut message)?;
        producer.send(message.as_bytes(), None)?;
    }
}
```
The above code demonstrates how to initialize a Pulsar client, create a producer, and publish messages to a Pulsar topic.

## Consuming Messages with Rust
With the Rust Pulsar client, consuming messages is straightforward. We can consume messages either individually or in batches.

```rust
// Consume messages from a Pulsar topic
let mut consumer = client
    .consumer()
    .with_topic("persistent://public/default/chat")
    .with_consumer_name("rust-consumer-1")
    .with_subscription_type(pulsar::ConsumerType::Exclusive)
    .build()?;

// Consume messages individually
let message = consumer.receive().await?;
println!(
    "Received message: {}",
    String::from_utf8_lossy(message.payload())
);

// Consume messages in batches
let messages = consumer.batch_receive().await?;
for message in messages {
    println!(
        "Received message: {}",
        String::from_utf8_lossy(message.payload())
    );
}
```
In the above example, we create a new consumer and consume messages from a Pulsar topic individually and in batches.

## Building Chat Applications with Rust and Pulsar
Now that we have seen how to produce and consume messages with Rust and Pulsar, let's build a real-time chat application leveraging Pulsar topics.

To accomplish this, we will use a WebSocket server to receive client requests and broadcast messages to connected clients through the Pulsar message broker.

```rust
// Import the necessary libraries
use std::collections::HashMap;
use std::sync::Arc;

use futures::stream::StreamExt;
use tokio::sync::mpsc::{channel, Receiver, Sender};
use tokio::sync::Mutex;
use tokio_tungstenite::tungstenite::Message;
use tokio_tungstenite::{accept_async, WebSocketStream};
use tokio::task;

use pulsar::{Consumer, Pulsar, TokioExecutor};

// Set up global variables for connected clients, channels to receive and broadcast messages, and a lock for thread-safe data transfer
type PeerMap = Arc<Mutex<HashMap<String, Sender<Message>>>>;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Set up a new pulsar instance
    let client = Pulsar::builder("pulsar://localhost:6650")
        .executor(TokioExecutor)
        .build()
        .await?;

    // Set up the chat topic
    let topic = "persistent://public/default/chat";

    // Clone the peer map to make it accessible in both the broadcasting and receiving loops
    let peers = PeerMap::new(Mutex::new(HashMap::new()));
    let peers_cloned = peers.clone();

    // Start a new task that broadcasts messages received from the Pulsar topic to all connected clients.
    task::spawn(async move {
        let mut consumer: Consumer;
        loop {
            consumer = client
                .consumer()
                .with_topic(topic)
                .with_consumer_name("rust-consumer-1")
                .with_subscription_type(pulsar::ConsumerType::Exclusive)
                .build()
                .await.unwrap();

            if let Ok(Some(msg)) = consumer.try_recv().await {
                let msg_string = String::from_utf8_lossy(&msg.payload().to_vec());
                // Broadcast the received message to all connected clients
                let mut guard = peers.lock().await;
                for (_id, tx) in guard.iter_mut() {
                    let _ = tx.send(Message::text(msg_string.to_owned())).await;
                }
            }
        }
    });

    // Start a WebSocket server and spawn client connections as individual futures
    let mut listener = tokio::net::TcpListener::bind("127.0.0.1:9001").await?;
    while let Ok((stream, _)) = listener.accept().await {
        let peer_map = peers_cloned.clone();
        task::spawn(async move {
            let ws_stream = accept_async(stream).await.unwrap();
            let (mut tx, rx) = channel(100);

            // Add the new connection's sender to the list of connected clients
            let mut guard = peer_map.lock().await;
            let new_peer_id = uuid::Uuid::new_v4().to_string();
            guard.insert(new_peer_id.clone(), tx);

            // Receive messages from this client and broadcast them to all connected clients
            let receive_msgs = rx.map(Ok).forward(ws_stream.clone());
            let broadcast_msgs = {
                async move {
                    while let Some(msg) = ws_stream.message().await.unwrap().into_text() {
                        let mut guard = peer_map.lock().await;
                        for (id, tx) in guard.iter_mut() {
                            tx.send(Message::text(format!(
                                "[{}] {}",
                                id,
                                msg
                            ))).await;
                        }
                    }
                }
            };

            tokio::select! {
                _ = receive_msgs => (),
                _ = broadcast_msgs => (),
            }

            // Remove the sender from the list of connected clients
            guard.remove(&new_peer_id);
        });
    }

    Ok(())
}
```
The above code demonstrates how to set up a real-time chat server with Rust and Pulsar using a WebSocket server and broadcasting messages through Pulsar.
 
## Conclusion
In this post, we have explored how to use Rust and Pulsar to build high-performance message-based applications. We saw how to produce and consume messages using the Rust Pulsar client, and leveraged that knowledge to build a real-time chat application with Pulsar topics. With Rust and Pulsar, you can create fast, scalable, and reliable message-based applications with ease.