---
title: "Implementing the Flyweight Design Pattern in C"
date: 2023-06-14T06:02:32.948Z
tags: ["c#","design patterns"]
---


The Flyweight design pattern is a creational pattern that is used to minimize the memory footprint of an application. It helps to achieve this by reusing common state information between objects instead of storing the same information in multiple objects. This technique is particularly useful when a large number of small objects are required to be created in an application, and memory is a concern.

In this post, we will discuss the Flyweight design pattern and its implementation in C#.

## Understanding the Flyweight Design Pattern

The Flyweight pattern focuses on optimizing memory usage by sharing objects. It aims to minimize memory usage by sharing as much data as possible with similar objects. The basic idea behind this pattern is that we can reduce the memory usage by having objects share some state information rather than replicating it in multiple objects.

In this pattern, two types of objects are defined: flyweights and contexts. Flyweight objects are immutable objects that store intrinsic state information, which is shared across multiple objects. Context objects hold extrinsic state information, which is unique to each object. A flyweight factory is responsible for creating and managing flyweight objects.

![Flyweight UML Diagram](https://upload.wikimedia.org/wikipedia/commons/4/41/Wmmflyweight.png)

Source: Wikipedia

## Implementing the Flyweight Pattern in C#

Let's consider a simple example to better understand how to implement the Flyweight pattern in C#. Assume that we are creating an application to render circles of different colors on a user interface. 

First, we'll define a flyweight class (called `Circle`) that will store common state information for all circles, such as the color.

```csharp
public class Circle
{
    private readonly Color _color;
 
    public Circle(Color color)
    {
        _color = color;
    }
 
    public void Draw(Point point)
    {
        Console.WriteLine($"Drawing {_color} circle at ({point.X}, {point.Y})");
    }
}
```

Note that the `Circle` class is immutable and stores only the intrinsic state (i.e., the color). The `Draw` method is defined to render the circle at a specified `Point`.

Next, we'll define a flyweight factory class (called `CircleFactory`) to manage the creation of flyweight objects, and store previously created objects in a dictionary. 

```csharp
public class CircleFactory
{
    private readonly Dictionary<Color, Circle> _circles = new Dictionary<Color, Circle>();
 
    public Circle GetCircle(Color color)
    {
        if (!_circles.ContainsKey(color))
        {
            Console.WriteLine($"Creating a {_color} circle");
            _circles[color] = new Circle(color);
        }
 
        return _circles[color];
    }
}
```

The `CircleFactory` maintains a dictionary of previously created `Circle` objects. When a new circle is requested, the `GetCircle` method is called and the requested color is used as a lookup key in the dictionary. If an existing `Circle` object is found, it is returned; otherwise, a new `Circle` object is created and added to the dictionary.

Finally, we'll define a `Client` class that uses the flyweight factory to create and draw random circles in different colors at random `Points`.

```csharp
public class Client
{
    private readonly CircleFactory _factory;
 
    public Client(CircleFactory factory)
    {
        _factory = factory;
    }
 
    public void Render()
    {
        var random = new Random();
 
        for (var i = 0; i < 10; i++)
        {
            var color = Color.FromArgb(random.Next(256), random.Next(256), random.Next(256));
            var circle = _factory.GetCircle(color);
            var point = new Point(random.Next(800), random.Next(600));
 
            circle.Draw(point);
        }
    }
}
```

The `Client` class creates random circles by requesting circles of different random colors from the factory and drawing them at random `Point`s.

## Conclusion

The Flyweight pattern is a useful design pattern that optimizes memory usage by sharing objects. It is useful in scenarios where a large number of small objects are required, and memory usage is a concern. Implementing this pattern in C# is straightforward, and can be accomplished by defining a flyweight class to store common state information, a context class to store unique state information, and a flyweight factory class to manage the creation and sharing of flyweight objects.