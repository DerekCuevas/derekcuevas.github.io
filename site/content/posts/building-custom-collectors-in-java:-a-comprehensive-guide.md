---
title: "Building Custom Collectors in Java: A Comprehensive Guide"
date: 2023-07-24T01:31:47.195Z
tags: ["java","stream api","collectors"]
authors: ["gpt-3.5-turbo-0301"]
---


# Building Custom Collectors in Java: A Comprehensive Guide

**Collectors** are a powerful utility class in Java's Stream API that allow you to accumulate elements of a stream into a collection. While there are a number of built-in collectors, you may occasionally need to write a custom collector to perform some unique operation with the stream's elements. This guide will walk you through the process of building custom collectors in Java.

## Overview of Collectors

Before diving into custom collectors, let's review how collectors work in Java's Stream API. Collectors are used to convert a stream into a collection or other type of object. In its simplest form, a collector consists of three functions:

1. **Supplier:** creates a new mutable container that will hold the accumulated elements.
2. **Accumulator:** adds an element to the container.
3. **Finisher:** converts the container into the final result.

For example, the following code creates a `List` of all even integers in a stream:

```java
List<Integer> evens = numbers.stream()
    .filter(n -> n % 2 == 0)
    .collect(Collectors.toList());
```

In this case, `Collectors.toList()` is a built-in collector that creates a new `ArrayList` and adds each element of the stream to it using the `add` method.

## Building a Custom Collector

To build a custom collector, you'll need to implement these three functions in a `Collector` object.

```java
Collector<Integer, List<Integer>, List<Integer>> evensCollector =
        Collector.of(
                ArrayList::new, // supplier
                (evens, n) -> {
                    if (n % 2 == 0) evens.add(n);
                }, // accumulator
                (evens1, evens2) -> {
                    evens1.addAll(evens2);
                    return evens1;
                }, // combiner
                Collector.Characteristics.IDENTITY_FINISH // finisher
        );

List<Integer> evens = numbers.stream()
    .collect(evensCollector);
```

Let's break it down:

### Supplier

The **supplier** function creates a new mutable container that will hold the accumulated elements. In this case, we're creating a new `ArrayList`.

```java
ArrayList::new
```

### Accumulator

The **accumulator** function adds an element to the container. In this case, we're adding even integers to the list.

```java
(evens, n) -> {
    if (n % 2 == 0) evens.add(n);
}
```

### Combiner

The **combiner** function is used when the stream is split into multiple sub-streams for parallel processing. It combines the results from each sub-stream into a single result. In this case, we're simply adding the elements of one list to another.

```java
(evens1, evens2) -> {
    evens1.addAll(evens2);
    return evens1;
}
```

### Finisher

The **finisher** function is an optional operation that transforms the intermediate container into the final result. In this case, we're using `Collector.Characteristics.IDENTITY_FINISH` to indicate that the container is the final result. 

```java
Collector.Characteristics.IDENTITY_FINISH
```

## Custom Characteristics

In addition to the three required functions, a collector can also specify one or more **characteristics** that indicate how the collector behaves. These are specified as an `EnumSet<Collector.Characteristics>` object passed as the last parameter to the `Collector.of` method.

```java
(ints, n) -> {
    if (n % 2 == 0) ints.add(n);
},
(ints1, ints2) -> {
    ints1.addAll(ints2);
    return ints1;
},
EnumSet.of(Collector.Characteristics.UNORDERED)
```

Here are some common characteristics:

- **CONCURRENT:** Indicates that the collector is safe to be used concurrently in a parallel stream.
- **IDENTITY_FINISH:** Indicates that the finisher function is the identity function and the container holds the final result.
- **UNORDERED:** Indicates that the collection does not maintain order.

## Conclusion

Building custom collectors can be a powerful tool for manipulating streams in Java. By implementing the three required functions (supplier, accumulator, and combiner) and optionally specifying characteristics, you can create collectors that perform unique operations with stream elements.