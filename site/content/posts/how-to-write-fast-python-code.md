---
title: "How to Write Fast Python Code"
date: 2023-06-06T06:02:48.793Z
tags: ["python","optimization"]
---

Python is known for being a high-level and easy-to-learn programming language. However, it is often considered slow when compared to compiled languages such as C or Go. Fortunately, with the following tips, you can fine-tune your Python code to make it run much faster.

## Use built-in functions and libraries

When you first start writing Python code, it is easy to write everything from scratch. However, many built-in functions and libraries are designed for optimal performance in Python. For example, the `map()` function can be used to apply a function to each element of a list in a single call, which is much faster than iterating over it with a `for` loop. In the same way, the built-in `sort()` function is much faster than implementing your own sorting algorithm.

## Turn on compiler optimizations

The default compiler optimization flags used by CPython are conservative and may not produce the fastest code possible. However, you can enable additional optimization flags by setting the `CFLAGS` environment variable when building Python from source. For example, to enable all available optimizations on Linux:

```
$ export CFLAGS="-Ofast -march=native -flto"
$ ./configure --enable-optimizations
$ make -j
$ sudo make install
```

## Use a JIT compiler

Python code can also benefit from just-in-time (JIT) compilation. One popular JIT compiler for Python is [PyPy](https://pypy.org/), which can be used as a drop-in replacement for CPython. PyPy can provide significant speedup for certain types of Python code. For example, PyPy can be up to 10 times faster when running numerical benchmarks compared to CPython.

## Use NumPy for numerical computations

If you are doing computational work in Python, consider using the NumPy library. NumPy is an optimized numerical computing library for Python, allowing operations on arrays to be performed much faster than using built-in Python functions. For example, using NumPy to calculate a dot product:

```python
import numpy as np

a = np.array([1, 2, 3])
b = np.array([4, 5, 6])

np.dot(a, b)
```

## Avoid global variables

Global variables in Python can be convenient, but they come at a performance cost. Accessing a global variable requires a look-up in the global namespace, which can be slow. Instead, use local variables or pass variables as arguments to functions as much as possible.

## Use comprehensions and generators

Comprehensions and generators are Python constructs that allow you to generate sequences of data in a more efficient manner than using `for` loops. List and dictionary comprehensions can be used to create lists and dictionaries in a single line of code without the need for a `for` loop. Generators are similar to comprehensions but produce results lazily on-demand.

## Conclusion

Python is a great language for quickly prototyping ideas and writing clear, maintainable code. By following these tips, you can improve the performance of your Python code and make it run much faster.