---
title: "Building real-time collaborative web apps with Operational Transformation"
date: 2023-06-04T18:02:11.620Z
tags: ["web development","operational transformation","collaborative applications"]
---


## Introduction
Real-time collaborative web applications, such as Google Docs and Trello boards, have become an integral part of our personal and professional lives. These applications allow multiple users to work together on the same document or board at the same time and see each other's changes in real-time. This is accomplished using Operational Transformation (OT) - a technique used to synchronize changes between different users and their client-side representations of data. 

In this post, we will explore the basics of OT and learn how to implement OT-based real-time collaborative features in our web applications.

## Operational Transformation (OT)
Operational Transformation is a technique used to synchronize changes across multiple clients in real-time. It is used to ensure that all clients have the same view of data at any given point in time, regardless of who made the changes and when.

OT is based on the concept of transforming operations using a sequence of operations. When a user makes a change to a document or board, the change is transformed before it is sent to other clients. This is done by comparing the change with the changes made by other clients, and then applying certain rules to transform the change.

## Understanding OT in Action
Let’s consider an example. Suppose two users, Alice and Bob, are collaborating on a Google Docs document. Alice types the word "operational" and Bob types the word "transformation". Both of these changes are sent to the server.

Let’s assume that the server receives Alice’s change first. The server will then transform Bob’s change to reflect Alice’s change as follows:
```
Transform("transformation", Insert(12, "operational"))
```
This operation takes the original string "transformation" and inserts the text "operational" at index 12, giving us the final string "transformational".

This transformed operation is then sent back to Bob’s client, which updates its representation of the document.

This is just a basic example of how OT works, but it gives you an idea of how the technique is used to synchronize changes across multiple clients.

## Implementing OT in Web Applications
Implementing OT in web applications can be challenging, but it is made easier with existing libraries and tools. Here are a few options to consider:

### ShareDB
ShareDB is a client-server database that automatically syncs data between clients. It is built on top of Operational Transformation and supports both JSON and rich-text formats. ShareDB uses a WebSocket connection for real-time communication and conflict resolution.

### Yjs
Yjs is a JavaScript framework that enables real-time collaboration in web applications. It is built on top of CRDTs and uses Operational Transformation to resolve conflicts. Yjs supports multiple types of data, including text, JSON, and XML.

### Automerge
Automerge is a library for building real-time collaborative applications. It uses a unique conflict resolution technique based on "mergeable replicated data types" (MRDTs) that can automatically resolve conflicts. Automerge is designed to work with any programming language or database, and uses JSON for data storage and transfer.

## Conclusion
Operational Transformation is a powerful technique that enables real-time collaboration in web applications. While implementing OT can be challenging, there are existing libraries and frameworks that make it much easier. By understanding the basics of OT and using these tools, you can build real-time collaborative applications that can transform the way we work and collaborate online.