---
title: "Using the Adapter Pattern to Integrate Legacy Code"
date: 2023-06-05T12:03:16.775Z
tags: ["software design","adapter pattern","legacy code integration"]
authors: ["gpt-3.5-turbo-0301"]
---



## Introduction

Integrating legacy code into new systems can be an arduous and time-consuming process. A common requirement during systems integration is the need to communicate and exchange data between different systems. This can be challenging when dealing with legacy systems, which were often built with different technologies and design patterns compared to more modern systems. The Adapter Pattern is a popular design pattern that can help mitigate this issue by providing an abstraction layer to mediate between the legacy code and the modern system.


## What is the Adapter Pattern?

The Adapter Pattern is a structural design pattern that allows two incompatible interfaces to work together. It aims to map the interface of one class to another interface that the client expects. This pattern is useful when an object wants to interact with a system component but does not have an interface that is compatible with the system’s API. This pattern can be especially useful when trying to integrate legacy systems with modern applications.

In the Adapter Pattern, adapters convert the interface of an existing class into another interface. These adapters help legacy code integrate with modern systems more easily by enabling communication between the different systems. The adapter essentially acts as a translator between different sets of interfaces and APIs.

## Example Scenario

Now, imagine that you have been tasked with integrating an old payment processing system into a new e-commerce website. The payment processing system is a legacy system written in Java, and it has a different API than the e-commerce website, which uses REST APIs. As such, you need to implement an adapter to translate the Java API into the REST API.

First, you could create an interface that both the payment processing system and the REST API will implement. This interface will define a common set of methods that both systems should support. Then, you could create a Java adapter class that implements this interface and translates the Java API to the common interface. Lastly, you could create a REST adapter class that receives requests formatted according to the common interface and translates them to the corresponding REST API.

Here is an example of how you could create these classes:

### The common interface

```java
public interface PaymentProcessor {
    void chargeCreditCard(String cardNumber, double amount);
}
```

### The Java Adapter

```java
public class JavaPaymentProcessor implements PaymentProcessor {
    private final LegacyPaymentSystem paymentSystem = new LegacyPaymentSystem();

    @Override
    public void chargeCreditCard(String cardNumber, double amount) {
        paymentSystem.chargeCard(cardNumber, amount);
    }
}
```

### The REST Adapter

```java
public class RestPaymentProcessor implements PaymentProcessor {
    private final String apiUrl;

    public RestPaymentProcessor(String apiUrl) {
        this.apiUrl = apiUrl;
    }

    @Override
    public void chargeCreditCard(String cardNumber, double amount) {
        // Format the request according to the REST API
        String request = formatRequest(cardNumber, amount);
        
        // Send the request to the REST API
        sendRequest(request);
    }
    
    private String formatRequest(String cardNumber, double amount) {
        return "POST " + apiUrl + " HTTP/1.1\n" +
               "Content-Type: application/json\n\n" +
               "{\"cardNumber\":\"" + cardNumber + "\",\"amount\":" + amount + "}";
    }
    
    private void sendRequest(String request) {
        // Implementation for sending the HTTP request goes here
    }
}
```

## Conclusion

Systems integration is a challenging and time-consuming process, especially when dealing with legacy systems. The Adapter Pattern is an effective tool for integrating legacy code into modern systems and can help reduce the amount of time it takes to integrate systems. Additionally, the Adapter Pattern can help simplify the process of communication between different systems and reduce the complexity of the overall system architecture.

In this article, we explored an example scenario where the Adapter Pattern could be used to integrate a legacy payment processing system into a modern e-commerce website. By creating a common interface and implementing adapter classes for both systems, the payment processing system could be used within the e-commerce website without needing to modify the legacy code itself.