---
title: "Building a Distributed Key-Value Store on Top of Apache Kafka"
date: 2023-06-10T18:02:26.324Z
tags: ["apache kafka","distributed systems","data storage"]
---


## Introduction

In a typical distributed system, there are many challenges that must be addressed when it comes to storing and retrieving data. One common approach to this problem is the use of a key-value store. A key-value store is a data storage system that allows you to store and retrieve data based on a unique key.

In this post, we'll explore how to build a key-value store on top of Apache Kafka, a distributed stream processing system. We'll discuss how to use Kafka to store and retrieve key-value data, and provide a few code snippets along the way.

## Apache Kafka

Apache Kafka is a distributed stream processing system that is commonly used for building high-throughput, fault-tolerant, and scalable applications. At its core, Kafka is a distributed log system that allows you to store records in partitions across multiple nodes. 

In Kafka, partitions are the unit of parallelism. Each partition is an ordered, immutable sequence of records that can be consumed by one or many consumers.

## Getting Started

To get started, we'll need to create a new Kafka topic to store our key-value data. We'll create a topic with three partitions, a replication factor of three, and a cleanup policy of `compact`, which is optimized for storing key-value data.

```bash
$ bin/kafka-topics.sh --create \
    --bootstrap-server localhost:9092 \
    --replication-factor 3 \
    --partitions 3 \
    --topic my-key-value-store \
    --config cleanup.policy=compact
```

Next, we'll write some code to produce values to our new Kafka topic. For the sake of simplicity, we'll assume that our key-value store only holds strings.

```java
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import java.util.Properties;

public class MyValueProducer {
    public static void main(String[] args) {
        Properties props = new Properties();
        props.put("bootstrap.servers", "localhost:9092");
        props.put("key.serializer", "org.apache.kafka.common.serialization.StringSerializer");
        props.put("value.serializer", "org.apache.kafka.common.serialization.StringSerializer");
        
        KafkaProducer<String, String> producer = new KafkaProducer<>(props);
        
        String key = "my-key";
        String value = "Hello, world!";
        
        ProducerRecord<String, String> record = new ProducerRecord<>("my-key-value-store", key, value);
        
        producer.send(record);
        producer.close();
    }
}
```

This code creates a new Kafka producer, sends a single key-value record to our topic, and then closes the producer.

## Retrieving Values

Now that we've written some key-value data to our Kafka topic, let's look at how we can retrieve it. We'll use the Kafka Streams API to create a new stream processor that reads data from our topic, and prints out each key-value pair that it reads.

```java
import org.apache.kafka.streams.KafkaStreams;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.StreamsConfig;
import org.apache.kafka.streams.KeyValue;
import org.apache.kafka.common.serialization.Serde;
import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.streams.kstream.KStream;

import java.util.Properties;

public class MyValueProcessor {
    public static void main(String[] args) {
        Properties props = new Properties();
        props.put(StreamsConfig.APPLICATION_ID_CONFIG, "my-key-value-processor");
        props.put(StreamsConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        
        final Serde<String> stringSerde = Serdes.String();
        final Serde<byte[]> dataSerde = Serdes.ByteArray();
        
        StreamsBuilder builder = new StreamsBuilder();
        
        KStream<String, String> myKeyValueStream = builder.stream("my-key-value-store");
        
        myKeyValueStream.foreach((key, value) -> {
            System.out.printf("key = %s, value = %s\n", key, value);
        });
        
        KafkaStreams stream = new KafkaStreams(builder.build(), props);
        stream.start();
    }
}
```

This code creates a new Kafka Streams application, which reads data from our key-value store and uses a `foreach` method to print out each key-value pair.

## Conclusion

In this post, we've seen how to build a distributed key-value store on top of Apache Kafka using the Kafka Streams API. We've explored how to create a Kafka topic optimized for storing key-value data, and seen how to use the Kafka producer API to write values to our topic. We've also seen how to use the Kafka Streams API to read values from our topic.

Although the example above is for strings only, it can be extended to other data types as well, such as JSON or Avro. The possibilities are endless with Kafka and the Kafka Streams API.