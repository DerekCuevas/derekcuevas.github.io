---
title: "How to Use the Decorator Pattern for Flexible and Extensible Code"
date: 2023-06-09T00:06:02.015Z
tags: ["design patterns","decorator pattern","object-oriented programming"]
---


Object-oriented programming has been popular for decades now, and with it, many code design patterns as solutions for common programming challenges. The Decorator pattern is one of such design patterns. Although not as frequently used as other patterns like the Singleton, or the Factory Method, the Decorator pattern does have its place in the programmer's toolbox. In this post, we will explore the Decorator pattern, learn how to use it, and see the benefits it brings to our code's flexibility and extensibility.

## Introduction to the Decorator Pattern

The Decorator pattern is a design pattern that allows us to add additional behavior to an object dynamically. It is used when we want to extend the functionality of an object without changing its original behavior. 

In other words, the Decorator pattern provides us with a way to add or modify the behavior of an object at runtime, without subclassing it. This makes it particularly useful in situations where subclassing is not feasible, or where a class has many variants and creating a subclass for each variant would be impractical.

## How to Implement the Decorator Pattern

The Decorator pattern is implemented by creating a decorator class that wraps around the original object and adds the desired behavior. The decorator class implements the same interface that the original object implements, and it maintains a reference to the original object. Whenever a method is called on the decorator object, the decorator's implementation is executed first, and then the implementation of the original object is executed.

Let's see an example in Python code. Suppose we have a Pizza class that represents a basic pizza type, and we want to add toppings to it. We can create a ToppingDecorator class that adds those toppings, like this:

```python
class Pizza:
    def get_description(self) -> str:
        pass
    
    def get_cost(self) -> float:
        pass
    
class MargheritaPizza(Pizza):
    def get_description(self) -> str:
        return "Margherita"

    def get_cost(self) -> float:
        return 8.0

class ToppingDecorator(Pizza):
    def __init__(self, pizza: Pizza):
        self._pizza = pizza

    def get_description(self) -> str:
        return self._pizza.get_description()

    def get_cost(self) -> float:
        return self._pizza.get_cost()

class CheeseTopping(ToppingDecorator):
    def __init__(self, pizza: Pizza):
        super().__init__(pizza)

    def get_description(self) -> str:
        return f"{self._pizza.get_description()}, Cheese"

    def get_cost(self) -> float:
        return self._pizza.get_cost() + 1.0

class PepperTopping(ToppingDecorator):
    def __init__(self, pizza: Pizza):
        super().__init__(pizza)

    def get_description(self) -> str:
        return f"{self._pizza.get_description()}, Pepper"

    def get_cost(self) -> float:
        return self._pizza.get_cost() + 1.5
```
In this example, we have a Pizza abstract class that defines two methods: `get_description` and `get_cost`, which will be overridden by its concrete classes `MargheritaPizza`, and `ToppingDecorator`.

The `ToppingDecorator` also implements the same `get_description` and `get_cost` methods and serves as the base class for specific toppings implementations like `CheeseTopping` and `PepperTopping`.

Here we can see that the `get_description` method of the pizza object is accessed first by the `CheeseTopping` object when `get_description` is called on the `CheeseTopping` object. Then `CheeseTopping` adds a new string to the output of the `Pizza` object's implementation to represent the cheese topping, before returning it.

The same mechanism applies to the `get_cost` method. Here, the `Pizza` object's cost is obtained first before the cheese topping's cost is added to the total sum.

Now that we have implemented our decorator pattern for topping addition, let's see how we can use it.

```python
basic_pizza = MargheritaPizza()
print(basic_pizza.get_description())  # Margherita
print(f"Cost: {basic_pizza.get_cost()}$")  # 8.0$

cheese_pizza = CheeseTopping(MargheritaPizza())
print(cheese_pizza.get_description())  # Margherita, Cheese
print(f"Cost: {cheese_pizza.get_cost()}$")  # 9.0$

pepper_pizza = PepperTopping(MargheritaPizza())
print(pepper_pizza.get_description())  # Margherita, Pepper
print(f"Cost: {pepper_pizza.get_cost()}$")  # 9.5$
```
By calling the `CheeseTopping` or `PepperTopping` objects with a `MargheritaPizza` object, we can add toppings dynamically while using the same Pizza interface. As we can see from the output of the code, these toppings are reflected in the description and the cost of the pizza.

## Benefits of the Decorator Pattern

Using the Decorator pattern in our code can provide several benefits. For example, it allows us to add or remove behavior dynamically at runtime, which can make our code more flexible. It also makes our code more extensible since we can add new classes that implement the same interface and decorate the original object with new behavior.

Moreover, the Decorator pattern promotes code reuse since we can create decorator classes that add behavior to different objects, which can save us from creating many subclasses for each of the object variants.

## Conclusion

In this post, we have learned about the Decorator pattern, seen how to implement it in Python code, and understood its benefits. The Decorator pattern is a powerful tool that provides us with a flexible and extensible way to add or remove behavior to an object at runtime. By employing this pattern, we can make our code more modular, reusable, and easier to maintain.