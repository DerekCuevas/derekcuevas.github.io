---
title: "Building a Highly Scalable Kafka Consumer in Go"
date: 2023-06-14T18:02:59.606Z
tags: ["go","kafka","distributed systems"]
---



Apache Kafka is a high-performance distributed streaming platform that can handle large amounts of real-time data. It is widely used for building event-driven systems, real-time processing, and messaging applications. In this article, we will explore how to build a highly scalable Kafka consumer in Go.

## Kafka Consumer Concepts

A Kafka consumer is an application that reads messages (records) from a Kafka topic. Typically, a Kafka consumer is part of a larger distributed system that processes and analyzes data in real-time. 

When building a Kafka consumer, there are a few important concepts to keep in mind:

- **Topic** - A Kafka topic is a category or feed name that messages are published to and consumed from. A topic can have one or more partitions.
- **Partition** - A topic is divided into one or more partitions, which allow multiple consumers to read from a topic in parallel. Each partition is an ordered and immutable sequence of records.
- **Offset** - An offset is a unique identifier that represents a specific location in a partition.
- **Consumer Groups** - A consumer group is a set of consumers that work together to consume messages from a topic. Each consumer in a group reads from a unique partition. The Kafka broker automatically balances partition assignments across consumer instances in a group.

## Setting Up a Kafka Consumer in Go

To get started with building a Kafka consumer in Go, we need a few dependencies. First, we need the `sarama` Kafka client. This client library is officially supported by the Apache Kafka community and provides full support for Kafka operations, including topics, messages, producers, and consumers.

```go
package main

import (
    "fmt"
    "log"

    "github.com/Shopify/sarama"
)
```

Next, we need to create a new Kafka consumer instance using the `sarama` client library.

```go
func main() {
    config := sarama.NewConfig()
    config.Consumer.Return.Errors = true

    brokers := []string{"localhost:9092"}
    topics := []string{"my-topic"}

    consumer, err := sarama.NewConsumer(brokers, config)
    if err != nil {
        log.Fatal(err)
    }
    defer func() {
        if err := consumer.Close(); err != nil {
           log.Fatal(err)
        }
    }()
}
```

We can now create a Kafka consumer group member and join a consumer group. When joining a consumer group, we also need to provide a name for the group. Consumer group names help identify different consumer groups in the system and enable Kafka brokers to balance partition assignments accordingly.

```go
    group, err := sarama.NewConsumerGroup(brokers, groupID, config)
    if err != nil {
        log.Fatal(err)
    }
    defer func() {
        if err := group.Close(); err != nil {
            log.Fatal(err)
        }
    }()

    handler := ConsumerHandler{}

    for {
        err := group.Consume(context.Background(), topics, &handler)
        if err != nil {
            log.Fatal(err)
        }
    }
```

Finally, we need to define a Kafka message handler function that gets called every time a new message is received by the consumer. 

```go
type ConsumerHandler struct {
}

func (c *ConsumerHandler) Setup(_ sarama.ConsumerGroupSession) error {
    return nil
}

func (c *ConsumerHandler) Cleanup(_ sarama.ConsumerGroupSession) error {
    return nil
}

func (c *ConsumerHandler) ConsumeClaim(session sarama.ConsumerGroupSession, claim sarama.ConsumerGroupClaim) error {
    for msg := range claim.Messages() {
        fmt.Printf("Message Topic:%q Partition:%d Offset:%d Value:%s\n", msg.Topic, msg.Partition, msg.Offset, string(msg.Value))
        session.MarkMessage(msg, "")
    }
    return nil
}
```

The `ConsumeClaim` function is where we will define our message processing logic. For each message, we will print the message's topic, partition, offset, and value and then mark the message as processed using the `MarkMessage` function.

With our Kafka consumer group member created, we can now start processing messages from our Kafka topic.

## Improving Kafka Consumer Performance

In a real-world distributed system, it is essential to build a Kafka consumer that can handle high message volumes without compromising performance and scalability.

One technique for improving Kafka consumer performance is to use a worker pool to distribute message processing across multiple worker threads. By doing so, we can improve message throughput and keep our Kafka consumers responsive even under high message volumes.

```go
func main() {
    // ...

    workerCount := 10

    group, err := sarama.NewConsumerGroup(brokers, groupID, config)
    if err != nil {
        log.Fatal(err)
    }
    defer func() {
        if err := group.Close(); err != nil {
            log.Fatal(err)
        }
    }()

    for i := 0; i < workerCount; i++ {
        go func() {
            handler := ConsumerHandler{}

            for {
                err := group.Consume(context.Background(), topics, &handler)
                if err != nil {
                    log.Printf("Error processing message: %v", err)
                }
            }
        }()
    }

    // ...
}
```

By creating a worker pool with multiple worker threads, we can increase message throughput and improve resilience to high message volumes.

Another technique to improve Kafka consumer performance is to pre-fetch messages from Kafka using the `Prefetch` setting. Pre-fetching messages allows the Kafka consumer to buffer unread messages in memory, reducing the number of round trips between the Kafka broker and consumer and improving throughput.

```go
    config := sarama.NewConfig()
    config.Consumer.Return.Errors = true
    config.Consumer.MaxWaitTime = 1 * time.Second
    config.Consumer.Fetch.Default = 1024 * 1024
    config.Consumer.Fetch.Min = 128 * 1024
    config.Consumer.Fetch.Max = 10 * 1024 * 1024
    config.Consumer.Group.Session.Timeout = 30 * time.Second
    config.Consumer.Group.Heartbeat.Interval = 10 * time.Second
    config.Consumer.Group.Rebalance.Strategy = sarama.BalanceStrategyRoundRobin
    config.Consumer.Group.Rebalance.Timeout = 30 * time.Second
    config.Consumer.Group.Rebalance.Retry.Max = 2

    config.ChannelBufferSize = 256
    config.Version = sarama.MaxVersion
    config.Metadata.Full = false
    config.Metadata.Retry.Max = 3

    config.Consumer.MaxProcessingTime = 250 * time.Millisecond
    config.Consumer.Prefetch = 500

    // ...
```

By setting the `Prefetch` configuration option, we can control the maximum number of messages we want to buffer in memory, which improves message throughput.

## Conclusion

In this article, we explored how to build a highly scalable Kafka consumer in Go. We covered the basics of Kafka consumer concepts and saw how to use the `sarama` client library to create and configure a Kafka consumer instance.

We then looked at some techniques to improve Kafka consumer performance, including using a worker pool and pre-fetching messages. By implementing these techniques, we can build performant and scalable Kafka consumers that can handle high message volumes without compromising performance.