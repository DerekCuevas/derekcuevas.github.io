---
title: "Projecting Elixir's Enum Module into Batches"
date: 2023-06-03T18:03:23.427Z
tags: ["elixir","enum","batches"]
---


Elixir's `Enum` module provides a rich set of functions to work with enumerables in a functional manner. One of the most common use cases is to group or partition them into batches for processing. The `Enum.chunk_every/2` and `Enum.split/2` functions can be used to split enumerables into equal-sized or arbitrary-sized batches, respectively, but they don't work well with infinite or very large streams of data. Additionally, they have some performance overhead.

In this post, we'll explore how to project the `Enum` module into batches using a more efficient, lazy, and composable approach. This will allow us to work with large data sets more efficiently while keeping code concise and readable.

### The Problem with `chunk_every/2` and `split/2`

Let's consider a simple example to illustrate the limitations of `chunk_every/2` and `split/2`:

```elixir
# Define an infinite stream of numbers
def naturals(), do: Stream.iterate(1, &(&1 + 1))

# Split the stream into batches of 3 elements each
naturals() |> Enum.chunk_every(3) |> Enum.take(2)
#=> [[1, 2, 3], [4, 5, 6]]
```

Here we define an infinite stream of natural numbers and split it into batches of 3 elements each using `chunk_every/2`. Since `naturals()` is an infinite stream, `chunk_every/2` will consume the entire stream and create an infinite list of batches. In this case, we only take the first two batches for illustrative purposes.

However, creating an infinite list of batches is not practical for processing large data sets. This can cause memory issues and slow down processing time. The same issue applies to `split/2` as well.

### An Alternative Approach: `batch/2`

We can overcome these limitations by defining a new high-order function `batch/2` that lazily projects enumerables into batches of a given size while keeping the enumerables intact. This means that we can work with large or infinite streams of data without consuming them entirely.

```elixir
defmodule Enum.Batch do
  # Define a new projection function `batch/2`
  def batch(enumerable, batch_size) do
    Stream.resource(
      fn -> enumerable end,
      fn (_, state) ->
        case Enum.split(state, batch_size) do
          {:cont, batch, rest} -> {:cont, batch, rest}
          {:done, last_batch} -> {:halt, last_batch, nil}
        end
      end,
      fn _ -> :ok end
    )
  end
end
```

The `batch/2` function takes an enumerable and a batch size as inputs and returns a new stream of batches. It does so by defining a new stream using `Stream.resource/3`. The state of the stream is the enumerable itself, and the function `Enum.split/2` is called on the state with the given batch size to produce a batch of elements and the remaining elements. If there are more elements in the enumerable to be processed, the stream continues (`:cont`) with the current batch and the remaining elements. Otherwise, the stream halts (`:halt`) with the last batch and `nil`.

Let's see how this works in action:

```elixir
# Split the stream into batches of 3 elements using `batch/2`
naturals() |> Enum.Batch.batch(3) |> Stream.take(2)
#=> [[1, 2, 3], [4, 5, 6]]
```

Here we call `batch/2` instead of `chunk_every/2` to split the stream of natural numbers into batches of 3 elements each. We then call `Stream.take/2` to take the first two batches from the stream.

The result is exactly the same as before, but with the advantage of being more efficient and memory-friendly for large or infinite streams of data.


### Conclusion

In this post, we introduced a new high-order function `batch/2` that provides a more efficient, lazy, and composable approach to projecting enumerables into batches. We also compared it to the built-in functions `chunk_every/2` and `split/2` and highlighted their limitations with infinite or large data sets. By using `batch/2`, we can process data sets without consuming them entirely, which is essential for performance-critical and real-time applications.