---
title: "Mastering C++17 Template Argument Deduction"
date: 2023-06-26T18:02:23.584Z
tags: ["c++","templates","programming"]
---



Template argument deduction is an essential feature of C++ templates that allows for the automatic deduction of template arguments. Introduced in C++17, template argument deduction for class templates has been enhanced to support deduction guides, which provide additional information to the compiler to facilitate the deduction process. In this post, we'll explore the basics of template argument deduction in C++17 and demonstrate how to write efficient and expressive code using this powerful feature.

## Basic Template Argument Deduction

Template argument deduction occurs when the compiler determines the template arguments based on the types of function arguments or variables. The most common example is the `std::vector` class template:

```c++
std::vector<int> v = { 1, 2, 3 }; // Template argument deduction
```

In this example, the type of `v` is deduced from the initializer list `{ 1, 2, 3 }`. The compiler determines that the template parameter `T` for `std::vector` should be `int`. It's worth noting that template argument deduction is only possible if the type can be deduced unambiguously.

## Class Template Argument Deduction

C++17 introduces class template argument deduction, which allows the compiler to deduce the class template arguments from the constructor arguments. Consider the following example:

```c++
template<typename T>
class container {
    T* data;
    int size;
public:
    container(T* d, int s) : data(d), size(s) {}
};

container c{ new int[10], 10 }; // C++17 class template argument deduction
```

In this example, the compiler deduces that `T` should be `int` based on the constructor arguments `new int[10]` and `10`. This type of deduction is particularly useful for library designers who want to make their interfaces more expressive and easy to use.

## Deduction Guides

Deduction guides are a new feature introduced in C++17 that provide additional information to the compiler to facilitate the deduction process. A class template can have one or more deduction guides, which are special functions that provide a set of arguments to be used for template argument deduction. Consider the following example:

```c++
template <typename T>
class my_container {
public:
    my_container(T& data, int size) {}
};

my_container<int*> c{ new int[10], 10 }; // Error: template argument deduction fails

template <typename T>
my_container(T*, int) -> my_container<T*>; // Deduction guide

my_container c{ new int[10], 10 }; // C++17 class template argument deduction
```

In this example, we define a deduction guide for the `my_container` class template. The deduction guide takes two arguments and returns a `my_container<T*>` object. With the deduction guide in place, the compiler can deduce the correct type `T` to be `int`, and the code compiles without errors. We can now use `my_container` with a pointer to `int` without having to specify the template argument explicitly, making our code more concise and expressive.

Deduction guides can also be used to create synthetic constructors for a class template that are not part of the original implementation. For example, we can define a deduction guide that takes a string and returns a `my_container<char*>`:

```c++
template <typename T>
my_container(const std::basic_string<T>&, int) -> my_container<const T*>; // Deduction guide

my_container c = { "hello", 5 }; // C++17 class template argument deduction
```

In summary, C++17 introduces powerful new features for template argument deduction, including class template argument deduction and deduction guides. These features can help library designers create expressive and easy-to-use interfaces and make it easier for developers to write more concise and efficient code.