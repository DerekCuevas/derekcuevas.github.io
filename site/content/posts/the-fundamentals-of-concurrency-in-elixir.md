---
title: "The Fundamentals of Concurrency in Elixir"
date: 2023-06-25T00:28:33.645Z
tags: ["elixir","concurrency","parallelism"]
---


Concurrency is an essential concept in modern software engineering, particularly when building distributed systems. Elixir, with its robust concurrency model based on the Actor model, is a great language for building such systems. In this post, we will go through the fundamentals of concurrency and parallelism in Elixir.

## Concurrency versus Parallelism

Before diving into Elixir's concurrency model, it's important to understand the difference between concurrency and parallelism. While the two terms are often used interchangeably, they do have distinct meanings.

Concurrency refers to the ability for multiple tasks or processes to be executed simultaneously, even if only one CPU is available. In a concurrent system, tasks are scheduled in such a way that it appears that they are being executed simultaneously. However, each task is executed only for a brief period of time before being paused and then resumed later.

Parallelism, on the other hand, refers to the ability to execute multiple tasks simultaneously across multiple CPUs or cores. In a parallel system, tasks can truly be executed simultaneously because there are enough physical resources to handle them.

## The Actor Model

Elixir's concurrency model is based on the Actor model, which was originally introduced by Carl Hewitt in the 1970s. In the Actor model, each process is an independent actor that communicates asynchronously with other actors by sending and receiving messages. The state of an actor is encapsulated, so actors can't directly access the state of other actors.

Let's look at an example of using Elixir's concurrency model to implement a simple counter.

```elixir
defmodule Counter do
  def start(starting_value) do
    spawn_link(fn -> loop(starting_value) end)
  end

  defp loop(value) do
    receive do
      {:increment, sender} ->
        new_value = value + 1
        IO.puts("Incremented to #{new_value}")
        send(sender, {:ok, new_value})
        loop(new_value)

      {:get, sender} ->
        send(sender, {:ok, value})
        loop(value)

      {:stop, sender} ->
        send(sender, :ok)
    end
  end
end
```

In this example, we define a `Counter` module that provides three functions: `start`, `loop`, and `receive`. The `start` function initializes a new counter process that runs the `loop` function. The loop function receives messages through the `receive` construct and updates the counter accordingly.

To increment the counter, we send the `Counter` process a message that specifies that we want to increment the counter. The `loop` function receives this message and increments the value. It then sends a message back to the sender with the new value and continues to run the `loop` function.

To get the value of the counter, we send the `Counter` process a message that specifies that we want to get the value. The `loop` function receives this message and sends a message back to the sender with the current value.

To stop the counter process, we send the `Counter` process a message that specifies that we want to stop it. The `loop` function receives this message and sends a message back to the sender with an `:ok` value, which terminates the process.

## Parallelism in Elixir

While it's true that Elixir's concurrency model is based on the Actor model, which is a concurrent model, the language also offers features that enable parallelism.

For example, Elixir provides the `Task.Supervisor` module that can be used to spawn and monitor multiple tasks. The `Task.Supervisor` module is used to manage a group of tasks as a single unit and automatically restarts failed tasks.

Here's an example of using `Task.Supervisor` to spawn and monitor multiple tasks:

```elixir
defmodule ParallelCounter do
  def start(starting_value, num_counters) do
    children = Enum.map(1..num_counters, fn(_) ->
      {Task, fn() -> Counter.loop(starting_value) end}
    end)

    supervisor = Task.Supervisor.start_link(strategy: :one_for_one)

    Task.Supervisor.async_nolink(supervisor, children)
  end
end
```

In this example, we define a `ParallelCounter` module that takes in a starting value and the number of counters to spawn. We spawn multiple `Counter` processes and group them together using the `Task.Supervisor` module. The resulting supervisor is responsible for monitoring and restarting failed tasks.

## Conclusion

Elixir's concurrency model based on the Actor model provides a powerful and flexible way to build concurrent systems. While concurrency and parallelism are different concepts, Elixir provides options for both. The `Task.Supervisor` module enables parallelism, while the `receive` construct enables concurrency. The ability to easily mix the two concepts is one of the strengths of Elixir.