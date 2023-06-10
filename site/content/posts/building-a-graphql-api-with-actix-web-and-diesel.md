---
title: "Building a GraphQL API with Actix-Web and Diesel"
date: 2023-06-10T12:02:55.170Z
tags: ["rust","graphql","actix-web","diesel"]
---


GraphQL is a powerful query language for APIs that allows clients to request exactly the data they need, making it easier to develop APIs that provide flexible and efficient responses. In this tutorial, we will build a GraphQL API using Rust, Actix-Web, and Diesel.

## Prerequisites

To follow along with this tutorial, you should have a basic understanding of Rust, Actix-Web, and Diesel. You should also have Rust, Cargo, and Diesel installed on your machine.

## Setting up the project

Let's start with creating a new Rust project and adding the necessary dependencies. In the project root directory, create a new file called `Cargo.toml` and put the following code inside:

```toml
[package]
name = "actix-graphql"
version = "0.1.0"
edition = "2018"

[dependencies]
actix-web = "3.3.2"
actix-rt = "2.4.1"
serde = "1.0.127"
serde_derive = "1.0.127"
juniper = "0.14.2"
juniper_actix = "0.3.1"
diesel = "1.4.5"
diesel_derives = "1.4.1"
r2d2 = "0.8.8"
r2d2_diesel = "1.0.0"
qstring = "0.6.0"
```

Then, run the following command to create the `src` directory and the main source file called `main.rs`:

```bash
mkdir src && touch src/main.rs
```

## Creating a GraphQL Schema

Next, let's define our GraphQL schema. Create a new file called `schema.graphql` in the project root directory and add the following code:

```graphql
enum Episode {
  NEWHOPE
  EMPIRE
  JEDI
}

type Character {
  id: ID!
  name: String!
  friends: [Character!]
  appearsIn: [Episode!]!
}

input NewCharacterInput {
  name: String!
  friends: [ID!]!
  appearsIn: [Episode!]!
}

type Query {
  characters(ids: [ID!]!): [Character!]!
}

type Mutation {
  createCharacter(input: NewCharacterInput!): Character!
}
```

This schema defines two types: `Character` and `Episode` and two root queries: `Query` and `Mutation`. The `Query` type allows us to retrieve a list of `Character`s given an array of `ID`s, and the `Mutation` type allows us to create a new `Character` using the `NewCharacterInput` input type.

## Defining the Rust types

Next, let's define the Rust types that correspond to the GraphQL types. In the `src/main.rs` file, add the following code:

```rust
#[macro_use]
extern crate diesel;

mod models;
mod schema;

use actix_web::{web, App, HttpRequest, HttpResponse, HttpServer, Responder, Result};
use juniper::*;
use juniper_actix::*;
use r2d2::Pool;
use r2d2_diesel::ConnectionManager;

type DbPool = Pool<ConnectionManager<diesel::PgConnection>>;

#[derive(Debug)]
struct Context {
    db_pool: DbPool,
}

impl juniper::Context for Context {}

#[derive(Clone, Debug, Queryable)]
pub struct Character {
    pub id: i32,
    pub name: String,
}

#[derive(Insertable)]
#[table_name = "characters"]
pub struct NewCharacter<'a> {
    pub name: &'a str,
}

pub struct QueryRoot;

#[juniper::object(Context = Context)]
impl QueryRoot {
    fn characters(context: &Context, ids: Vec<i32>) -> Vec<Character> {
        use crate::schema::characters::dsl::*;

        let connection = context.db_pool.get().unwrap();
        characters.filter(id.eq_any(ids)).load::<Character>(&connection).unwrap()
    }
}

pub struct MutationRoot;

#[juniper::object(Context = Context)]
impl MutationRoot {
    fn create_character(
        context: &Context,
        input: NewCharacterInput,
    ) -> FieldResult<Character> {
        use crate::schema::characters;

        let connection = context.db_pool.get().unwrap();
        diesel::insert_into(characters::table)
            .values(&NewCharacter { name: &input.name })
            .get_result(&connection)
            .map_err(|err| FieldError::new("Failed to insert new character", graphql_value!({ "error": err.to_string() })))
    }
}

fn main() -> std::io::Result<()> {
    let database_url = std::env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let manager = ConnectionManager::<diesel::PgConnection>::new(database_url);
    let db_pool = r2d2::Pool::builder().build(manager).unwrap();

    HttpServer::new(move || {
        let context = Context { db_pool: db_pool.clone() };
        let schema = std::sync::Arc::new(
            juniper::RootNode::new(QueryRoot {}, MutationRoot {})
                .introspection_modifier(|&mut _| {})
        );
        App::new()
            .data(context)
            .wrap(ContentType::json())
            .service(
                web::resource("/")
                    .route(web::post().to(graphql_handler(schema.clone())))
                    .route(web::get().to(playground_handler("/"))),
            )
    })
    .bind("localhost:8080")?
    .run()
}
``` 

We start by importing the necessary dependencies, defining the `Context` struct that will hold the database connection pool, and implementing the `juniper::Context` trait. Then, we define the `Character` and `NewCharacter` Rust structs that correspond to the `Character` and `NewCharacterInput` GraphQL types, respectively. 

Next, we define the `QueryRoot` and `MutationRoot` types that correspond to the root `Query` and `Mutation` types in our schema, respectively, and implement the corresponding GraphQL resolvers using Diesel to query the database.

Finally, we create the `HttpServer` and define its routes, but instead of handling GraphQL requests directly, we use the `juniper_actix` crate to handle them for us.

## Running the application

To start the server, create a `.env` file in the root directory and add the following line:

```
DATABASE_URL=postgres://localhost/actix-graphql
```

Then, run the following command:

```bash
cargo run
```

Visit `http://localhost:8080` to access the GraphQL playground and try running some queries and mutations.

## Conclusion

In this tutorial, we have built a GraphQL API using Rust, Actix-Web, and Diesel. With this setup, you should be able to build more complex APIs with a powerful and flexible GraphQL query language.