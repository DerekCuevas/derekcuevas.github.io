---
title: "Mastering the Actor Model Concurrency Paradigm in Elixir"
date: 2023-06-07T18:03:28.780Z
tags: ["elixir","actor model","concurrency"]
---


## Introduction

Concurrency is an important aspect of software development, especially in the era of distributed computing. It is becoming increasingly important to design systems that can handle multiple requests concurrently without sacrificing performance. Elixir is a functional programming language that is built around the Actor model concurrency paradigm. The Actor model is a mathematical model that allows for the creation of concurrent, autonomous entities called actors. In this post, we will explore the Actor model and how Elixir uses it to provide efficient and scalable concurrency. We will also demonstrate how to use Elixir actors to build a simple networked echo server.

## The Actor Model

The Actor model is a mathematical model that defines a set of rules for dealing with concurrent computation. The model is based on three main concepts: Actors, Messages, and Addresses.

#### Actors

An Actor is a concurrent computation entity that is capable of executing a set of instructions and sending and receiving messages to and from other actors. An actor is an autonomous entity and has its own state that can only be modified by the execution of instructions inside the actor. In the Actor Model, actors are isolated from each other and communicate only through exchanging messages. 

#### Messages

In the Actor model, communication between actors always happens through sending and receiving messages. A message is a piece of data that is sent from one actor to another actor.

#### Addresses

An address is like an address of the actor, which is used to send messages back and forth between actors. An address is a reference to an actor that can be used to send and receive messages. It allows actors to communicate with each other without knowing each other's internal state.

## Elixir Actors

Elixir is a functional programming language that is built around the Actor model. In Elixir, actors are implemented as processes that run in parallel. Each process has a unique process ID that can be used to send and receive messages. Elixir provides a simple and powerful syntax to spawn and interact with processes.

To spawn a new process, we can use the `spawn/1` function. The `spawn/1` function takes a lambda as its argument. The lambda will contain the code that the new process will execute. The result of the `spawn/1` function is a process ID that can be used to send messages to the process that has just been spawned.

```elixir
pid = spawn fn ->
  # Code to execute in the new process
end
```

To send a message to another Elixir process, we use the `send/2` function. The `send/2` function takes two arguments: the process ID of the process that we want to send a message to, and the message that we want to send.

```elixir
send pid, {:message, data}
```

To receive a message in an Elixir process, we use the `receive/1` function. The `receive/1` function takes a lambda as its argument. The lambda will contain the code to be executed when a message is received. The message can be matched against a pattern using the `=`, the `when`, and the `->` operators.

```elixir
receive do
  {:message, data} ->
    # Code to execute
end
```

## Building a Networked Echo Server

To demonstrate how to use the Actor model in Elixir, we will build a simple networked echo server that can handle multiple concurrent connections.

#### The `EchoServer` Process

The first step in building the echo server is to define the `EchoServer` process. The `EchoServer` process will listen for connections and spawn a new process for each incoming connection. The spawned process will be responsible for handling the incoming data and echoing it back to the client. 

```elixir
defmodule EchoServer do
  def start_link(port) do
    :gen_tcp.listen(port, [:binary, active: false, reuseaddr: true])
    |> spawn_link(fn (socket) ->
      loop_accept(socket)
    end)
  end

  defp loop_accept(socket) do
    case :gen_tcp.accept(socket) do
      { :ok, client_socket } ->
        spawn(fn () ->
          loop_recv(client_socket)
          :gen_tcp.close(client_socket)
        end)
        loop_accept(socket)

      { :error, :eagain } ->
        loop_accept(socket)

      { :error, reason } ->
        Logger.error("Failed to accept connection: #{reason}")
    end
end
```

In the `start_link/1` function, we create a new TCP listener on the specified port and spawn a new process to handle incoming connections. 

The `loop_accept/1` function uses the `:gen_tcp.accept/1` function to listen for incoming connections. When a new connection is accepted, a new process is spawned to handle the connection by calling the `loop_recv/1` function. The `loop_recv/1` function is responsible for receiving and echoing back the incoming data.

#### The `loop_recv` Process

The `loop_recv` process will continuously receive data from the client and echo it back to the client. 

```elixir
defp loop_recv(socket) do
  case :gen_tcp.recv(socket, 0) do
    { :ok, data } -> 
      :gen_tcp.send(socket, data)
      loop_recv(socket)

    {:error, reason} ->
      Logger.error("Failed to receive data: #{reason}")
      :gen_tcp.close(socket)
  end
end
```

In the `loop_recv/1` function, we use the `:gen_tcp.recv/2` function to receive data from the client. When data is received successfully, we simply send it back to the client using the `:gen_tcp.send/2` function. When an error occurs, we log the error and close the connection.

#### Starting the Server

Finally, to start the echo server, we simply call the `EchoServer.start_link/1` function with the desired port number.

```elixir
EchoServer.start_link(8080)
```

## Conclusion

The Actor Model is a powerful concurrency paradigm that can be used to build highly scalable systems. In Elixir, actors are implemented as processes that can communicate with each other by sending and receiving messages. We demonstrated how to use Elixir processes to build a networked echo server that can handle multiple concurrent connections. This provides only a small taste of what can be achieved with the Actor Model in Elixir. By mastering the Actor Model, you can build highly scalable and fault-tolerant systems that are capable of handling large amounts of concurrent requests.