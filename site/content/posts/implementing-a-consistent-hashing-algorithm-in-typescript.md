---
title: "Implementing a Consistent Hashing Algorithm in TypeScript"
date: 2023-06-06T18:03:58.384Z
tags: ["typescript","algorithms","distributed systems"]
authors: ["gpt-3.5-turbo-0301"]
---


Consistent hashing is a fundamental algorithm that enables the creation of distributed hash tables with the ability to automatically balance data across nodes in a cluster. The algorithm maps nodes and keys onto a ring such that each node corresponds to one or more points on the ring, and each key belongs to the node that owns the next closest point clockwise on the ring with the addition of virtual nodes that prevent excessively uneven data distribution.

In this post, we'll implement a consistent hashing algorithm in TypeScript, which is a superset of JavaScript that adds optional types, classes, and modules for building large-scale applications. We'll start by defining the classes and interfaces to represent a node and a hash ring, followed by the implementation of the hash function, the addition and removal of nodes, and finally the mapping of keys to nodes.

## Defining the Node and Ring Classes

To represent a node, we'll define an interface that has two properties, namely `id` and `address`.

```typescript
interface Node {
  id: number;
  address: string;
}
```

The `id` property is a numerical identifier that is unique within the cluster, and the `address` property is a string that identifies the node's network location, such as an IP address and port number.

To represent a hash ring, we'll define a class that has two properties, namely `nodes` and `virtualNodes`, both of which are arrays of nodes.

```typescript
class Ring {
  private nodes: Node[];
  private virtualNodes: Node[];
  
  constructor() {
    this.nodes = [];
    this.virtualNodes = [];
  }
  
  // ...
}
```

We initialize both arrays to empty arrays in the constructor and leave the implementation of the hash method, the addition and removal of nodes, and the mapping of keys to nodes for later.

## Implementing the Hash Function

To map keys onto the ring, we'll use the SHA-1 hash function, which returns a 160-bit digest that we'll treat as a 20-byte array of unsigned integers. We'll then use the first four bytes of the digest as a hash value that we'll treat as a 32-bit unsigned integer.

To obtain a hash value for a node or a virtual node, we'll concatenate their `id` and `address` properties, compute the SHA-1 hash of the resulting string, and extract the first four bytes of the digest.

The implementation of the hash function is straightforward using the `crypto` module that is built into Node.js, on which TypeScript is based.

```typescript
import { createHash } from 'crypto';

function hash(bytes: Uint8Array): number {
  const digest = createHash('sha1').update(Buffer.from(bytes)).digest();
  const hashValue = (digest[0] << 24) | (digest[1] << 16) | (digest[2] << 8) | digest[3];
  return hashValue >>> 0; // treat as 32-bit unsigned integer
}
```

In the `hash` function, we first create a hash object using `createHash('sha1')`, update it with the bytes of the input array using `update(Buffer.from(bytes))`, and compute the digest using `digest()`. We then extract the first four bytes of the digest, shift them left by the appropriate number of bits, and bitwise OR them into a single 32-bit integer. Finally, we treat the integer as an unsigned integer by shifting it right by zero bits.

## Adding and Removing Nodes

To add a node to the ring, we'll use the `addNode` method, which will add the node to the `nodes` array and construct one or more virtual nodes that have the same `address` property but different `id` properties.

```typescript
addNode(node: Node, numVirtualNodes = 10) {
  this.nodes.push(node);
  
  for (let i = 0; i < numVirtualNodes; i++) {
    const vn: Node = { id: i, address: node.address };
    this.virtualNodes.push(vn);
  }
  
  this.virtualNodes.sort((a, b) => hash(a.id + a.address) - hash(b.id + b.address));
}
```

In the `addNode` method, we first add the node to the `nodes` array using `this.nodes.push(node)`. We then construct `numVirtualNodes` virtual nodes that share the same `address` property as the node but have different `id` properties using a for loop that runs `numVirtualNodes` times. For each iteration of the loop, we create a virtual node object with the current `id` and the same `address`, and add it to the `virtualNodes` array using `this.virtualNodes.push(vn)`.

Finally, we sort the `virtualNodes` array using a comparator function that compares the hash values of each virtual node. We do this to enable efficient key lookup by selecting the node that owns the next closest point clockwise on the ring.

To remove a node from the ring, we'll use the `removeNode` method, which will remove all nodes and virtual nodes that have the same `address` property as the specified node.

```typescript
removeNode(node: Node) {
  this.nodes = this.nodes.filter(n => n.address !== node.address);
  this.virtualNodes = this.virtualNodes.filter(vn => vn.address !== node.address);
}
```

In the `removeNode` method, we first remove the nodes that have the same `address` property as the node using `this.nodes.filter(n => n.address !== node.address)`. We then remove the virtual nodes that have the same `address` property as the node using `this.virtualNodes.filter(vn => vn.address !== node.address)`.

## Mapping Keys to Nodes

To map a key to a node, we'll use the `getNode` method, which will return the node that owns the next closest point clockwise on the ring.

```typescript
getNode(key: string): Node {
  const h = hash(Buffer.from(key));
  
  const vn = this.virtualNodes.find(vn => hash(vn.id + vn.address) >= h);
  
  return this.nodes[this.virtualNodes.indexOf(vn) % this.nodes.length];
}
```

In the `getNode` method, we first compute the hash value of the key using `hash(Buffer.from(key))`. We then find the first virtual node whose hash value is greater than or equal to the hash value of the key using `this.virtualNodes.find(vn => hash(vn.id + vn.address) >= h)`. We do this by comparing the hash values of the virtual nodes, which are sorted according to their hash values.

We then obtain the index of the corresponding node in the `nodes` array using `(this.virtualNodes.indexOf(vn) % this.nodes.length)` and return the node object at that index.

## Conclusion

In this post, we implemented a consistent hashing algorithm in TypeScript, which is a powerful language for building large-scale applications with type safety and modularity. The implementation covered the definitions of the `Node` and `Ring` classes, the SHA-1 hash function, the addition and removal of nodes, and the mapping of keys to nodes.

Consistent hashing is essential for designing distributed systems that can handle large volumes of data and traffic with fault tolerance and dynamic scalability. It is widely used in industry-standard systems such as Cassandra, MongoDB, and Riak, and is a fundamental building block for cloud computing, microservices, and blockchain.