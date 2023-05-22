---
title: "Building Realtime Web Apps with Clojure and WebSockets"
date: 2023-05-21T06:20:42.337Z
tags: ["clojure","websockets","real-time web applications"]
---

Clojure is one of the most popular functional programming languages for the JVM. It is known for its expressiveness and simplicity, making it an excellent choice for building large-scale, high-performance web applications. And while there are many frameworks and libraries available for building these types of applications, Clojure's support for WebSockets makes it an ideal choice for building real-time web applications.

In this post, we will explore the basics of building real-time web applications with Clojure and WebSockets. We will cover the basics of setting up a WebSockets server, handling incoming messages, and broadcasting messages to all connected clients. By the end of this tutorial, you will have a basic understanding of how to build real-time web applications with Clojure and WebSockets.

## Prerequisites

To follow along with this tutorial, you will need basic knowledge of Clojure, the Clojure command line tools, and Leiningen.

## Setting up a WebSockets server

Before we can start building our real-time web application, we need to set up a WebSockets server. In this tutorial, we will be using the `http-kit` library to create our server. `http-kit` is a lightweight, high-performance HTTP server and client library for Clojure, and it also includes support for WebSockets.

First, we need to add the `http-kit` dependency to our `project.clj` file:

```
[org.httpkit/http-kit "2.4.1"]
```

Once we've added the dependency, we can create our server using the following code:

```clojure
(require '[org.httpkit.server :as server])

(defn websocket-handler
  [{:keys [socket channel]}]
  (channel
   (fn [message]
     (doseq [client (vals @channels)]
       (if-not (= client channel)
         (server/write-str client message))))))

(defn start-server []
  (let [handler (server/websocket-handler websocket-handler)]
    (server/run-server handler {:port 8080})))
```

This code sets up a handler function, `websocket-handler`, that will be called whenever a new WebSocket connection is established. The `channel` parameter is a reference to the WebSocket channel, which we can subscribe to and publish messages to.

## Handling incoming messages

Now that we have our WebSockets server set up, we can start handling incoming messages from clients. In our `websocket-handler` function, we can define a callback function that will be called whenever a new message is received:

```clojure
(defn websocket-handler
  [{:keys [socket channel]}]
  (channel
   (fn [message]
     ;; handle message here
     )
   (fn []
     ;; handle client disconnect here
     )))
```

The `message` parameter is a vector of bytes that contains the incoming message. We can convert this message to a string using the `bytes-to-str` function:

```clojure
(defn websocket-handler
  [{:keys [socket channel]}]
  (channel
   (fn [message]
     (let [message-str (bytes-to-str message)]
       (println "Received message: " message-str)))
   (fn []
     ;; handle client disconnect here
     )))
```

This code simply prints out the incoming message to the console.

## Broadcasting messages to all connected clients

Finally, we need to be able to broadcast messages to all connected clients. We can do this by storing a reference to all connected WebSocket channels in an atom. Whenever a new message is received, we can iterate over all the connected channels and write the message to each one. Here's the updated `websocket-handler` function:

```clojure
(def channels (atom #{}))

(defn websocket-handler
  [{:keys [socket channel]}]
  (swap! channels conj channel)
  (channel
   (fn [message]
     (doseq [client (vals @channels)]
       (if-not (= client channel)
         (server/write-str client message))))
   (fn []
     (swap! channels disj channel))))
```

This code adds and removes channels from the `channels` atom whenever a new WebSocket connection is established or closed. Whenever a new message is received, it iterates over all the channels and writes the message to each one, excluding the original sender.

## Conclusion

In this tutorial, we learned how to build real-time web applications with Clojure and WebSockets. We covered the basics of setting up a WebSockets server, handling incoming messages, and broadcasting messages to all connected clients. This is just a small taste of what's possible with Clojure and WebSockets, but it gives you a foundation to build more complex real-time web applications.
