---
title: "Building a Highly Available and Distributed Messaging System with Akka and Scala"
date: 2023-05-23T00:05:06.891Z
tags: ["akka","scala","messaging systems"]
---

In today's world where a large amount of data is being generated every second, messaging systems form a crucial part of any distributed system architecture. A messaging system makes sure that messages are delivered from one service to another in a reliable, fault-tolerant, and scalable manner.

Akka is a toolkit and runtime that simplifies building concurrent, distributed, and fault-tolerant systems by abstracting the complexity of implementing these systems in code. Scala's functional programming constructs make it an ideal language to build these systems in combination with Akka.

In this post, we will learn how to use Akka and Scala to build a highly available and distributed messaging system. The post will be divided into the following sections:

1. Setting up the Development Environment
2. Building the Core Messaging System with Akka Actors
3. Building Publisher and Subscriber Actors
4. Implementing Reliability and Disaster Recovery
5. Scaling the System with Akka Clustering

## Setting up the Development Environment

Before we begin, we need to set up our development environment with the required tools and libraries. We will use the following tools:

- Scala 2.13.x
- Akka 2.6.x
- sbt 1.4.x

## Building the Core Messaging System with Akka Actors

The first step in building a distributed messaging system is to define the core messaging system. We will use Akka actors to implement this.

An Akka actor is an object that encapsulates state and behavior, communicates asynchronously with other actors, and processes messages sent to it. Since actors share no state, they can be replicated or moved across multiple nodes in a cluster without any synchronization overhead.

With Akka, we can define the core messaging system as follows:

```
trait Message
case class PublisherMessage(topic: String, payload: String) extends Message
case class SubscriberMessage(topic: String, subscriber: ActorRef) extends Message
case class UnsubscribeMessage(topic: String, subscriber: ActorRef) extends Message

class MessagingSystem extends Actor {
  val topicToSubscribersMap = mutable.Map.empty[String, Set[ActorRef]]

  def receive: Receive = {
    case PublisherMessage(topic, payload) =>
      topicToSubscribersMap.get(topic).foreach(subscribers => subscribers.foreach(subscriber => subscriber ! payload))
    case SubscriberMessage(topic, subscriber) =>
      val currentSubscribersSet = topicToSubscribersMap.getOrElse(topic, Set.empty[ActorRef])
      val updatedSubscribersSet = currentSubscribersSet + subscriber
      topicToSubscribersMap += (topic -> updatedSubscribersSet)
    case UnsubscribeMessage(topic, subscriber) =>
      val currentSubscribersSet = topicToSubscribersMap.getOrElse(topic, Set.empty[ActorRef])
      val updatedSubscribersSet = currentSubscribersSet - subscriber
      topicToSubscribersMap += (topic -> updatedSubscribersSet)
    }
}
```

In this example, we define a `Message` trait as the base type for all messages, and then define three different message types: `PublisherMessage`, `SubscriberMessage`, and `UnsubscribeMessage`. 

We then define a `MessagingSystem` actor that keeps track of which subscribers are subscribed to which topics, and publishes messages to all subscribers subscribed to a particular topic whenever a `PublisherMessage` is received. The `MessagingSystem` actor also handles subscription and unsubscription requests from `SubscriberMessage` and `UnsubscribeMessage` messages respectively.

## Building Publisher and Subscriber Actors

With the core messaging system implemented, we can now create actors that represent publishers and subscribers in our system. 

```
case class InitPublisher(topic: String)
case class Publish(topic: String, payload: String)

case class InitSubscriber(topic: String)
case class Subscribe(topic: String, subscriber: ActorRef)
case class Unsubscribe(topic: String, subscriber: ActorRef)

class Publisher(messagingSystem: ActorRef) extends Actor {
  def receive: Receive = {
    case InitPublisher(topic) =>
      context become publishing(topic)
  }

  def publishing(topic: String): Receive = {
    case Publish(_, payload) =>
      messagingSystem ! PublisherMessage(topic, payload)
  }
}

class Subscriber(messagingSystem: ActorRef) extends Actor {
  def receive: Receive = {
    case InitSubscriber(topic) =>
      messagingSystem ! SubscriberMessage(topic, self)
    case Message(payload) => {
      // handle the received message
    }
  }
}
```

We define two different actor types here: `Publisher` and `Subscriber`. The `Publisher` actor is responsible for publishing messages to the messaging system, while the `Subscriber` actor is responsible for receiving published messages from the system.

When a `Publisher` is created, it sends an `InitPublisher` message to itself with the specified topic. When this message is received, the actor enters into a `publishing` state where it can receive `Publish` messages. Whenever a `Publish` message is received, it sends a `PublisherMessage` to the messaging system with the message's payload.

When a `Subscriber` is created, it sends an `InitSubscriber` message to itself with the specified topic. When this message is received, the actor sends a `SubscriberMessage` to the messaging system with itself as the subscriber. Whenever a message is received, it processes and handles it according to the business requirements.

## Implementing Reliability and Disaster Recovery

So far, we have built a messaging system that can reliably publish and receive messages between nodes in a cluster. 

However, we also need to make this system fault-tolerant by implementing reliability and disaster recovery mechanisms. One such mechanism is Akka Persistence.

Akka Persistence is a set of modules that provide event sourcing capabilities to your Akka actors. Event sourcing is a way to store events as they happen in the system, allowing us to replay these events in the case of a failure. This way, the state of the system can be reconstructed from scratch.

Akka Persistence can be used by extending the `PersistentActor` trait. A `PersistentActor` maintains a state that can be updated and persisted in response to received messages. When an actor is started, it can replay all persisted events to recover its previous state.

## Scaling the System with Akka Clustering

Finally, we need to consider how to scale our distributed messaging system with Akka clustering. Akka clustering allows multiple Akka nodes to discover each other and form a cluster.

To scale our messaging system, we can follow these steps:

1. Create a `ClusterActor` that can send messages to all the nodes in the cluster.
2. Create multiple instances of our messaging system, publishers, and subscribers and join them to the cluster.
3. Use Akka Distributed Pub-Sub to forward messages between nodes in the cluster.

By scaling the system this way, we can handle a large volume of data and traffic.

To conclude, building a messaging system using Akka and Scala can be a challenging task, but with their highly scalable and fault-tolerant systems, we can ensure a reliable and highly available system. With this guide, you should now have a good understanding of how to use Akka to build a distributed messaging system.
