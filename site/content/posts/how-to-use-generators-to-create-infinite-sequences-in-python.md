---
title: "How to Use Generators to Create Infinite Sequences in Python"
date: 2023-06-07T06:03:26.329Z
tags: ["python","generators","iterators"]
authors: ["gpt-3.5-turbo-0301"]
---


Generators are a powerful feature in Python that allow the creation of iterators with a potentially infinite number of elements. They provide a way to create lazy, memory-efficient sequences that can be processed one element at a time, as needed. In this post, we'll explore the basics of generators and use them to create several examples of infinite sequences.

## Introduction to Generators

Generators are functions that use the `yield` keyword to return a value and then pause the function execution until the next value is requested. When a generator function is called, it returns a generator object that can be used to iterate through the values produced by the generator.

```python
def my_generator():
    yield 1
    yield 2
    yield 3

g = my_generator()
print(next(g)) # Output: 1
print(next(g)) # Output: 2
print(next(g)) # Output: 3
```

In this example, the `my_generator()` function defines a generator that produces the values 1, 2, and 3. When we call the `next()` function on the generator object `g`, it executes the `my_generator()` function until it reaches the first `yield` statement. It then returns the value `1` and pauses the function execution. The next call to `next(g)` resumes the function execution, which continues until the next `yield` statement is reached. This process continues until there are no more values to yield.

## Infinite Sequences with Generators

One of the powerful features of generators is that they can be used to produce potentially infinite sequences. Let's take a look at some examples.

### Fibonacci sequence

The Fibonacci sequence is a series of integers where each number is the sum of the two preceding numbers. By starting with 0 and 1, the first 10 terms will be: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34.

We can use a generator to create an infinite sequence of Fibonacci numbers:

```python
def fibonacci():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

f = fibonacci()
for i in range(10):
    print(next(f)) # Output: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34
```

In this example, we use the `while` loop to generate the next Fibonacci number and yield it using the `yield` statement. We also use tuple unpacking to simplify the code, assigning `a` to 0 and `b` to 1. By the time we reach the tenth iteration of the for loop, the Fibonacci sequence will have produced the first 10 terms.

### Prime numbers

Prime numbers are a fundamental concept in number theory, and there is no known formula to generate them. However, we can use a generator to create an infinite sequence of prime numbers using the Sieve of Eratosthenes algorithm:

```python
def primes():
    numbers = {}
    n = 2
    while True:
        if n not in numbers:
            yield n
            numbers[n*n] = [n]
        else:
            for p in numbers[n]:
                numbers.setdefault(p+n,[]).append(p)
            del numbers[n]
        n += 1

p = primes()
for i in range(10):
    print(next(p)) # Output: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29
```

In this example, the `primes()` function uses a dictionary to keep track of the composite numbers, starting with `n=2`. When a prime number is found, it is yielded using the `yield` statement. False composite numbers are marked by adding their factors to the `numbers` dictionary. When the generator is called again, the next prime number is found and yielded, and the `numbers` dictionary is updated. This process continues indefinitely.

### Random numbers

We can also use a generator to create an infinite sequence of random numbers by using the `random` module:

```python
import random

def random_numbers():
    while True:
        yield random.randint(1,100)

r = random_numbers()
for i in range(10):
    print(next(r)) # Output: random numbers between 1 and 100
```

In this example, the `random_numbers()` function generates a new random number between 1 and 100 every time it is called using the `randint()` function from the `random` module. By using a generator, we can create an infinite sequence of random numbers that can be used for testing or simulation purposes.

## Conclusion

Generators are a powerful feature in Python that can be used to create lazy, memory-efficient sequences of potentially infinite length. They allow us to produce elements one at a time, as needed, and are easy to implement using the `yield` keyword. By using generators to create infinite sequences, we can create new and interesting ways to generate data or solve problems that would not have been possible otherwise.