---
title: "Advanced Swift: Using Protocol Composition to Achieve Type-Safe, Modular Code"
date: 2023-05-29T12:02:31.277Z
tags: ["swift","protocol composition","modularity"]
---


Swift is a great language for building large-scale, modular applications. One of the key mechanisms that enables this modularity is protocol composition. By combining multiple protocols, you can create a new protocol that encapsulates the behavior of all its components. In this post, we will explore how you can use protocol composition in Swift to achieve type-safe, modular code.

## What is Protocol Composition?

Protocol composition is the act of forming a new protocol by combining two or more existing protocols. The resulting protocol defines a set of requirements that are satisfied by types that conform to all the underlying protocols. For example, consider the following two protocols:

```swift
protocol Renderable {
    func render()
}

protocol Animatable {
    func animate()
}
```

We can compose these two protocols into a new protocol, `RenderAndAnimate`:

```swift
protocol RenderAndAnimate: Renderable, Animatable {}
```

Any type that conforms to `RenderAndAnimate` must now implement both `render()` and `animate()`. By using protocol composition, we have created a new, more specific protocol that can be used to define more complex behavior.

## Using Protocol Composition for Modularity

Protocol composition is especially useful for creating modular, reusable code. You can create a single protocol that combines all the requirements of a module of functionality, and then define concrete types that conform to that protocol.

For example, imagine you are building an app that uses a shared set of networking functionality. You could define a protocol, `NetworkingClient`, that combines all the functionality required to make a network request:

```swift
protocol NetworkingClient {
    func makeRequest(_ request: URLRequest, completion: @escaping (Result<Data, Error>) -> Void)
    func cancelRequest(_ request: URLRequest)
}
```

Then, you could define a concrete implementation of this protocol, `URLSessionClient`, that uses `URLSession` to make network requests:

```swift
class URLSessionClient: NetworkingClient {
    private let session: URLSession
    // Initializer, etc…

    func makeRequest(_ request: URLRequest, completion: @escaping (Result<Data, Error>) -> Void) {
        let task = session.dataTask(with: request) { data, response, error in
            // Handle response, error, etc…
            completion(result)
        }
        task.resume()
    }

    func cancelRequest(_ request: URLRequest) {
        // Cancel request
    }
}
```

Now, any component that needs to make a network request can depend on `NetworkingClient` instead of `URLSessionClient`. This makes it easy to switch out the implementation of `NetworkingClient` if necessary, without affecting any dependent components. In other words, the modularity of your code has been improved.

## Type-Safe Abstractions with Protocol Composition

Another benefit of protocol composition is the ability to create type-safe abstractions. By combining protocols, you can create a new type that encapsulates a specific set of behavior, and ensure that types conforming to the new protocol also conform to the underlying protocols.

For example, imagine you have several types that can be converted to and from `Data`, but do not have a shared parent type. You could define a protocol, `DataConvertible`, that requires types to implement both `init(data: Data)` and `func toData() -> Data`:

```swift
protocol DataConvertible {
    init(data: Data)
    func toData() -> Data
}
```

Then, you can create a new protocol that combines `DataConvertible` with `Codable`:

```swift
protocol CodableAndDataConvertible: DataConvertible, Codable {}
```

Now, any type that conforms to `CodableAndDataConvertible` must implement both `init(data: Data)` and `func toData() -> Data`, as well as the encoding and decoding methods required by `Codable`. This ensures that you can safely pass any `CodableAndDataConvertible` type to a function that expects a `DataConvertible` type, without having to worry about implementation details.

## Conclusion

Protocol composition is a powerful feature in Swift that enables modularity and type safety. By composing multiple protocols, you can create new, more specific protocols that encapsulate behavior and ensure type safety. This makes it easier to build large-scale, modular applications in Swift, while also making your code more reusable and maintainable.