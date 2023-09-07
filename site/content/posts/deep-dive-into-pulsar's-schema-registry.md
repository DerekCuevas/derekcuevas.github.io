---
title: "Deep Dive into Pulsar's Schema Registry"
date: 2023-09-07T01:25:06.145Z
tags: ["apache pulsar","schema registry","confluent schema registry"]
authors: ["gpt-3.5-turbo-0301"]
---


# Introduction

Apache Pulsar comes with a built-in Schema Registry that allows the producer to send messages in a structured format, and the consumer to process those messages accordingly. This feature is especially useful when dealing with different versions of messages or when having to process messages with evolving schemas. In this post, we'll take a deep dive into Pulsar's Schema Registry, its architecture, and compare it with other schema management tools like Confluent Schema Registry.

## Prerequisites

Before diving into this post, you should have basic knowledge of Apache Pulsar. Familiarity with client libraries like `pulsar-client`, and `pulsar-admin` is recommended. You should also have some understanding of the concept of schema management, Apache Avro serialization, and Deserialization.

## Architecture

Pulsar's Schema Registry is a lightweight http service that stores the schema version and its corresponding schema data in a registry. When a producer sends a message, it registers the schema version with the schema registry if that version hasn't already been registered. The consumer can fetch the schema from the schema registry when consuming that message to ensure that it's decoding the message in the right format.

The schema itself is stored in Pulsar as a special 'schema' entry in the namespace or topic policy after being registered by a producer. That way the schema data is stored as part of the topic itself. The schema entry is managed by the schema registry service.

Once the schema registry is up and running and the broker has the schema registry URL, producers and consumers can start communicating with the schema registry service.

## Using Pulsar's Schema Registry

To start using the Pulsar Schema Registry feature, you need to enable it in the Pulsar Broker configuration file. You can set the configuration `schema_registry_type` to "local" or "global". The local schema registry is a registry that's used only for a single Pulsar cluster, and the global schema registry is a registry that's shared across multiple clusters.

```conf
# Pulsar Broker configuration
# Enable Schema Registry
schema_registry_type=local
```
Once you have set up Pulsar Schema Registry, you can start sending messages with schema data.

```python
# Example of using the schema registry with Python client
from pulsar import Client, Message

client = Client('pulsar://localhost:6650')
producer = client.create_producer('topic-name', schema="AvroSchema")
msg = Message({'name': 'John', 'age': 28})
producer.send(msg)
```

In the above example, we created a Pulsar Producer with the `AvroSchema` serializer and sent a message with a dictionary containing the name and age fields.

## Comparing Pulsar Schema Registry and Confluent Schema Registry

Confluent Schema Registry is a distributed schema registry service provided by Confluent, the company behind Apache Kafka. It's built around Apache Avro for serialization and deserialization.

Here's how Pulsar's Schema Registry compares to Confluent Schema Registry:

### Integration with the messaging system
Pulsar's Schema Registry is built into the messaging system architecture itself, so it's easier to manage and scale. On the other hand, Confluent Schema Registry is a separate component that's managed separately from the messaging system. It requires some additional setup and management effort.

### Multi-tenancy support
In Pulsar, the Schema Registry is a service that can be used by any tenant of the cluster. Confluent Schema Registry is a separate service that needs to be run with the Kafka cluster, so it's limited to a single Kafka cluster.

### Performance
Since Pulsar's Schema Registry is a native part of the Pulsar messaging system, it can be more performant than the Confluent Schema Registry. Benchmarking has shown that Pulsar's Schema Registry has lower latency and generally better performance.

### Schema Evolution
Pulsar's Schema Registry includes built-in schema compatibility checks to ensure that new versions of the schema are compatible with older versions. Confluent Schema Registry has a more relaxed approach and allows the producer to register new versions of the schema even if they're not compatible with previous versions.

## Conclusion

Pulsar's Schema Registry is a powerful and easy-to-use feature of the Apache Pulsar messaging system. It simplifies schema management for producers and consumers while ensuring that messages are structured and consistent. We hope this post has given you an understanding of Pulsar's Schema Registry, how it works, and how it compares with other schema management tools like Confluent Schema Registry.