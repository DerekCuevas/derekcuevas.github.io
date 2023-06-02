---
title: "Mastering Elixir's GenServer Callbacks"
date: 2023-06-02T06:04:09.926Z
tags: ["elixir","otp","genserver"]
---


Elixir’s GenServer behavior is one of the most widely used abstractions in the Elixir ecosystem. It offers a simple but powerful way to define and implement fault-tolerant, concurrent, and distributed systems based on the Actor model. Understanding GenServer's callbacks is a fundamental skill for writing elegant and robust Elixir code. In this post, we will explore each of these callbacks in-depth, including which ones are mandatory and which ones are optional.

## GenServer Callbacks 101
Let's start with a brief introduction to the GenServer callbacks. In general, callbacks are just functions that we define to handle specific events or messages. In Elixir’s GenServer, callbacks are separated into two groups, required and optional. Required callbacks are functions that we must define if we want to use the GenServer behavior. Optional callbacks are functions that we can define to extend or customize the behavior of the server. Here is an overview of all the callbacks:

### Required Callbacks
- `init/1` - initializes the state of the server
- `handle_call/3` - handles synchronous messages (two-way) 
- `handle_cast/2` - handles asynchronous messages (one-way)
- `handle_info/2` - handles all other messages, including system messages

### Optional Callbacks
- `terminate/2` - cleans up resources and finalizes the server
- `code_change/3` - handles changes in the code of the server

## Required Callbacks
Let's now look at each of the required callbacks in detail.

### init/1
This function initializes the state of the server. It takes one argument as input, which is the argument we pass to the `GenServer.start_link/1,2` function. The `init/1` function must return one of two values: `{ :ok, state }` if the initialization is successful, or `{ :stop, reason }` if the initialization fails.

Here is an example of the `init/1` function:

```elixir
# Define a GenServer module
defmodule Example do
  use GenServer

  def init(arg) do
    IO.puts("Initializing server with arg #{arg}")
    { :ok, %{ count: 0 } }
  end
end

# Start the server
{:ok, pid} = GenServer.start_link(Example, "foo")
```

### handle_call/3
This function handles synchronous messages, also known as two-way messages. The `handle_call/3` function takes three arguments: the message, the `from` reference, and the state of the server. It must return one of two values: `{ :reply, reply, state }` if the processing is successful, or `{ :noreply, state }` if the processing is successful but we don't want to send a reply.

Here is an example of the `handle_call/3` function:

```elixir
def handle_call({ :incr }, _from, %{ count: count } = state) do
  IO.puts("Incrementing count")
  { :reply, count + 1, %{ state | count: count + 1 } }
end
```

### handle_cast/2
This function handles asynchronous messages, also known as one-way messages. The `handle_cast/2` function takes two arguments: the message and the state of the server. It must return the updated state of the server.

Here is an example of the `handle_cast/2` function:

```elixir
def handle_cast({ :reset }, %{ count: _count } = state) do
  IO.puts("Resetting count")
  %{ state | count: 0 }
end
```

### handle_info/2
This function handles all other messages, including system messages. The `handle_info/2` function takes two arguments: the message and the state of the server. It must return the updated state of the server.

Here is an example of the `handle_info/2` function:

```elixir
def handle_info({ :timeout }, %{ count: count } = state) do
  IO.puts("Timeout occurred")
  %{ state | count: count + 1 }
end
```

## Optional Callbacks
Let's now look at the optional callbacks in detail.

### terminate/2
This function is called when the server is about to terminate. It takes two arguments: the reason for termination and the current state of the server. It does not return any value.

Here is an example of the `terminate/2` function:

```elixir
def terminate(_reason, %{ count: count }) do
  IO.puts("Terminating server with count #{count}")
end
```

### code_change/3
This function is called when the code of the server is updated. It takes three arguments: the old version of the server, the new version of the server, and the current state of the server. It must return one of two values: `{ :ok, new_state }` if the code change is successful and the new state is valid, or `{ :error, reason }` if the code change is unsuccessful.

Here is an example of the `code_change/3` function:

```elixir
def code_change(_old_version, _new_version, state) do
  IO.puts("Code change occurred")
  { :ok, state }
end
```

## Conclusion
In this post, we explored each of the GenServer callbacks in-depth, including their purpose and expected behaviors. We learned that GenServer callbacks are separated into two groups, required and optional. Understanding how these callbacks work is essential when building fault-tolerant, concurrent, and distributed systems with Elixir.