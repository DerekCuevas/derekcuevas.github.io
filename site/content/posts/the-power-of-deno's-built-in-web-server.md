---
title: "The Power of Deno's Built-in Web Server"
date: 2023-07-08T18:01:53.552Z
tags: ["deno","web server","http"]
authors: ["gpt-3.5-turbo-0301"]
---


Deno is a modern JavaScript/TypeScript runtime designed with security and simplicity in mind. It comes with a built-in web server module that makes it easy to create and serve HTTP requests, making Deno an excellent choice for developing lightweight web applications or prototyping ideas. In this post, we'll explore the power of Deno's built-in web server and how to use it to develop RESTful web services.

## Creating a Basic HTTP Server
Deno's HTTP server API closely mirrors that of Node.js but comes with built-in TypeScript type definitions and better security features. The following example shows how to create a simple server that listens to incoming requests and returns a "Hello World" response.

```typescript
import { serve } from 'https://deno.land/std/http/server.ts';

const PORT = 8080;
const server = serve({ port: PORT });

console.log(`Server running on http://localhost:${PORT}/`);

for await (const request of server) {
  request.respond({ body: "Hello World\n" });
}
```

In this example, we use the `serve` function from the `std/http/server.ts` module to create an HTTP server that listens on port 8080. The `for await` loop listens for incoming requests, and for each request, we call the `respond` method of the request object with the response.

## Handling GET Requests
Handling HTTP GET requests is straightforward with Deno's web server. In the following example, we'll create a route that returns a JSON object containing a list of users.

```typescript
import { serve } from 'https://deno.land/std/http/server.ts';

interface User {
  id: number;
  name: string;
}

const users: User[] = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie" },
];

const PORT = 8080;
const server = serve({ port: PORT });

console.log(`Server running on http://localhost:${PORT}/`);

for await (const request of server) {
  if (request.method === "GET" && request.url === "/users") {
    request.respond({
      body: JSON.stringify(users),
    });
  } else {
    request.respond({ status: 404 });
  }
}
```

In this example, we define an interface for user objects and populate a list of three `User` objects. We then create a route that listens for GET requests to the `/users` URL path and responds by returning the `users` array as a JSON string using `JSON.stringify()`. If the request is not a GET request to the `/users` route, we simply return an HTTP 404 error response.

## Parsing Request Data
When building web applications, it's common to receive data as part of the request body or as URL parameters. Deno's HTTP server API provides methods to parse these request inputs easily. In the following example, we'll create a route that expects a `POST` request with a JSON object containing a user's `id` and `name`, and returns the user's `id` and `name` as part of a JSON object.

```typescript
import { serve } from 'https://deno.land/std/http/server.ts';

interface User {
  id: number;
  name: string;
}

const users: User[] = [];

const PORT = 8080;
const server = serve({ port: PORT });

console.log(`Server running on http://localhost:${PORT}/`);

for await (const request of server) {
  if (request.method === "POST" && request.url === "/users") {
    const body = await request.json();

    const { id, name }: { id: number, name: string } = body;

    const user = { id, name };
    users.push(user);

    request.respond({
      body: JSON.stringify(user),
    });
  } else {
    request.respond({ status: 404 });
  }
}
```

In this example, we define an empty list of `User` objects and create a route that listens for POST requests to the `/users` URL path. We use the `await request.json()` method to parse the request's JSON body and destructure the `id` and `name` properties into a new `user` object. We then add the user to the `users` array and return the user object as a response. Finally, if the request is not a POST request to the `/users` route, we return an HTTP 404 error response.

## Conclusion
Deno's built-in web server provides a simple and secure way to create RESTful web services in JavaScript/TypeScript. With the ability to easily handle HTTP requests and parse request data, Deno's HTTP server is an attractive option for developers looking for a lightweight, secure, and scalable way to build web applications and services.