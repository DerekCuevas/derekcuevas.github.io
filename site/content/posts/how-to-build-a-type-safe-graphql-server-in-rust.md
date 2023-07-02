---
title: "How to Build a Type-Safe GraphQL Server in Rust"
date: 2023-05-28T00:05:38.146Z
tags: ["rust","graphql"]
authors: ["gpt-3.5-turbo-0301"]
---


GraphQL is a popular query language created by Facebook for building APIs that might replace REST as the new standard for building web APIs. Rust is a programming language that is natively designed to provide safety and performance. Combining GraphQL and Rust can give you a type-safe server that performs well and is secure.

In this post, we'll explore how to build a type-safe GraphQL server in Rust using the code-first approach and the async-graphql library.

### Prerequisites

Before we start, make sure you have Rust and Cargo installed on your machine. You can do so by running the following command:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

### Creating a New Rust Project

To create a new Rust project, use the following command:

```
cargo new graphql-server
```

This will create a new directory with the name `graphql-server`, which will contain a basic project scaffold. Next, move into the project directory and add the `async-graphql` library as a dependency by adding the following line to your `Cargo.toml` file:

```toml
[dependencies]
async-graphql = "2.10.1"
```

This will download and install the `async-graphql` library when you run `cargo build`.

### Defining the Schema

Now we'll define the GraphQL schema for our server. In GraphQL, the schema describes the types and operations that can be performed on those types. To define the schema, create a new file called `schema.rs` in your project's `src` directory.

In `schema.rs`, define a new struct for the type that you want to expose in your schema. For example, let's define a simple User struct with an ID and a name:

```rust
pub struct User {
    pub id: UUID,
    pub name: String,
}
```

Now let's define a struct representing our GraphQL schema, along with a Query object that defines the operations that can be performed on our types:

```rust
use async_graphql::{Context, Object, Result};

pub struct Query;

#[Object]
impl Query {
    async fn users(&self, ctx: &Context<'_>) -> Result<Vec<User>> {
        // Fetch users from a database or some other source
        let users = vec![
            User { id: UUID::new(), name: String::from("Alice") },
            User { id: UUID::new(), name: String::from("Bob") },
        ];

        Ok(users)
    }
}
```

In this example, we define a `users` method on our `Query` object that fetches a list of users and returns them as a vector of `User` objects.

### Starting the Server

Now let's create a Rust HTTP server that can handle GraphQL requests. To do this, we'll use the `async_graphql::http::playground_source` function to create a GraphQL Playground endpoint, which allows us to test our GraphQL API interactively. We can then use the `async_graphql::http::GraphQL` struct to create an endpoint for our GraphQL API that can accept POST requests.

Here's what the code for our server might look like:

```rust
use async_graphql::{EmptyMutation, Schema};
use async_graphql::http::{playground_source, GraphQLPlaygroundConfig};
use tide::{http::mime, Body, Request, Response, Server};

mod schema;

#[async_std::main]
async fn main() -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    let schema = Schema::new(
        schema::Query,
        EmptyMutation,
    );

    let mut app = Server::new();

    let graphql_endpoint = async_graphql_tide::endpoint(schema);
    app.at("/graphql").post(graphql_endpoint);

    let graphql_playground = Body::from(playground_source(
        GraphQLPlaygroundConfig::new("/graphql"))).with_mime(mime::HTML);
    app.at("/").get(move |_| async move { Ok(Response::new(graphql_playground.clone())) });

    app.listen("localhost:8080").await?;

    Ok(())
}
```

This code creates a new `Schema` object with our `Query` type, an empty `Mutation` type, and any other types that we've defined in our schema. It then creates a new `tide::Server` object and registers two endpoints: one for serving the GraphQL Playground and one for accepting GraphQL requests.

To run the server, run the following command in your terminal:

```
cargo run
```

### Querying the Server

Now that our server is up and running, we can query it using the GraphQL Playground interface. Open your browser and navigate to `http://localhost:8080`. You should see the GraphQL Playground interface, which allows you to compose and execute GraphQL queries against your server.

To test the server, let's run a simple query that fetches all of the users in our system:

```graphql
{
  users {
    id
    name
  }
}
```

When you run this query, you should see a JSON response containing the ID and name of each user.

### Conclusion

In this post, we've explored how to build a type-safe GraphQL server in Rust using the `async-graphql` library. By defining a GraphQL schema using Rust code, we can take advantage of Rust's safety and performance while building a modern, type-safe web API.