---
title: "Mastering Apache Pulsar's Message Retention Policy"
date: 2023-07-01T00:06:06.025Z
tags: ["apache pulsar","real-time systems","messaging"]
---


Apache Pulsar is a distributed messaging system that has gained importance in recent years due to its ability to handle high-throughput and low-latency data streaming. Message retention policy is one of the core features of Apache Pulsar that ensures that the messages are not lost forever, in the case of a failure or when a consumer is not available for a certain period. In this post, we will discuss Apache Pulsar's message retention policy and different ways to manage it effectively.

## Introduction to Apache Pulsar's Message Retention Policy

At a high level, Apache Pulsar's message retention policy defines how long a message should be retained in a topic. Apache Pulsar offers two types of message retention policies: **time-based retention** and **size-based retention**. 

Time-based retention determines the amount of time that messages should be retained, while size-based retention defines the amount of data that a topic can hold before messages are overwritten. The retention policy can be specified at both the **namespace level** and the **topic level**.

## Time-Based Retention

Time-based retention is the most common type of retention policy and it is based on the age of the messages. Time-based retention is defined at the namespace level and can be overridden at the topic level. 

A time-based retention policy can be set in the Apache Pulsar broker configuration file (`broker.conf`) by setting the `defaultRetentionTimeMinutes` parameter. This sets the default time that messages will be retained for all topics in a namespace unless overridden at the topic level. Here is an example of setting time-based retention to 1 day:

```
messageRetentionTimeInMinutes=1440
```

To override this retention policy at the topic level,  set the `retentionTimeMinutes` parameter when creating the topic. Here is an example of overriding the default time-based retention policy to 30 days for a specific topic:

```sh
$ pulsar-admin topics create persistent://my-tenant/my-namespace/my-topic \
  --max-unacked-messages 1000 \
  --message-retention-time 30d
```

This command creates a new topic, `my-topic`, with a time-based retention policy of 30 days.

## Size-Based Retention

Size-based retention determines when a message should be evicted from a topic based on the size of the topic. When size-based retention is enabled, Apache Pulsar automatically deletes the oldest messages to make room for new messages. Size-based retention can also be set at the namespace level and overridden at the topic level.

To enable size-based retention for a namespace, set the `defaultRetentionSizeInMB` parameter in the `broker.conf`. This sets the maximum size allowed for topics in a namespace unless overridden at the topic level. Here is an example of setting size-based retention to 10 GB:

```
defaultRetentionSizeInMB=10240
```

To override this retention policy at the topic level, set the `retentionSizeInMB` parameter as shown below:

```sh
$ pulsar-admin topics create persistent://my-tenant/my-namespace/my-topic \
  --max-unacked-messages 1000 \
  --max-producers-per-topic 10 \
  --message-retention-size 10G
```

This command creates a new topic, `my-topic`, with a size-based retention policy of 10 GB.

## Time vs Size-Based Retention Policy

Choosing between time-based or size-based retention is not an easy decision. Both have pros and cons, and in most cases, a hybrid approach is the best solution. Below are some points to consider when choosing between the two policies:

- Time-based retention is useful when there is a legal or business requirement to retain the data for a fixed period.
- Size-based retention is useful when you do not care about the age of the message but want to ensure that you retain data for a specific period.
- Time-based retention can lead to data loss if the number of messages is too high to store or if the storage capacity is full. In contrast, Size-based retention will delete the oldest messages and keep the latest ones.
- Size-based retention allows you to control the storage capacity of a topic. At the same time, it requires additional monitoring to ensure that you do not run out of space for your stored data.

## Conclusion

Message retention is a critical feature of any messaging system, and Apache Pulsar's retention policies provide a flexible and efficient way to manage message retention. In this post, we covered the two main types of retention policies – time-based and size-based retention – and how they can be set at the namespace and topic level. We also discussed the pros and cons of each policy and provided you with enough information to make an informed decision on which approach to use when managing message retention in Apache Pulsar.