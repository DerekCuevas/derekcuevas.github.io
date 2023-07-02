---
title: "Building a Highly Scalable and Performant GraphQL API with Sangria"
date: 2023-06-05T06:03:49.816Z
tags: ["graphql","scala","sangria"]
authors: ["gpt-3.5-turbo-0301"]
---


GraphQL is a data query and manipulation language that enables clients to request data from the server. GraphQL enables you to request precisely the data you need, nothing more and nothing less, with just one request. In contrast to traditional RESTful APIs, where, every endpoint usually returns a fixed set of data with large, sprawling responses, GraphQL generates a hierarchical tree structure from a query, which contains only the data fields and relations that the client requested, minimizing network traffic and reducing server response time.

Sangria is a Scala GraphQL implementation that enables you to build type-safe GraphQL APIs using native Scala classes. It provides a rich set of features like batching, deferred resolution, and caching, which allow you to build high-performance and scalable GraphQL APIs that meet your specific business requirements.

This post gives an overview of how to build a GraphQL API server with Sangria, using the following components:

- GraphQL schema definition
- Data fetching and transformation
- Query execution and response formatting

## GraphQL schema definition

GraphQL APIs are defined by a GraphQL schema, which provides a contract for the incoming requests and outgoing responses. A schema defines the types of data entities in your API and the relationships between them.

In Sangria, you define the GraphQL schema using pure Scala code. Here is an example of how to define a simple schema with a single `Person` query:

```scala
import sangria.schema._
import sangria.macros.derive._
import scala.concurrent.ExecutionContext.Implicits.global

case class Person(name: String, age: Int)

val PersonType = deriveObjectType[Unit, Person](
  ObjectTypeDescription("A person"),
  DocumentField("name", "The name of the person"),
  DocumentField("age", "The age of the person"))

val QueryType = ObjectType(
  "Query",
  fields[Option[Person], Unit](
    Field("person",
      OptionType(PersonType),
      resolve = _ => Some(Person("Gloria", 28)),
      description = Some("A single person"))))
      
val schema = Schema(QueryType)
```

In this code, we use the `sangria.schema._` and `sangria.macros.derive._` imports to define the data entities. In this case, we define a `Person` case class with `name` and `age` fields. We then use the `deriveObjectType` function to derive a `PersonType` GraphQL object type from our `Person` case class.

We then define the `QueryType` GraphQL object type, which has a single `person` field of type `PersonType`. This field returns an `Option[Person]` type, representing a nullable `Person` object. We set the `resolve` function to return a predefined `Person` object with name "Gloria" and age 28. Lastly, we define the GraphQL schema using the `Schema` function, passing the `QueryType` object type.

## Data fetching and transformation

Once the GraphQL schema is defined, you need to fetch the data from the data source and transform it into the GraphQL schema format. Sangria provides a way to separate data fetching and data transformation into two separate stages, enabling you to optimize data fetching without sacrificing the clarity and simplicity of data transformation.

```scala
val PersonType = deriveObjectType[Unit, Person](
  ObjectTypeDescription("A person"),
  DocumentField("name", "The name of the person"),
  DocumentField("age", "The age of the person"),
  AddFields(
    Field("friends",
      ListType(PersonType),
      resolve = ctx => futureFriends(ctx.value.name),
      description = Some("The friends of the person"))))

val QueryType = ObjectType(
  "Query",
  fields[PersonRepo, Unit](
    Field("person",
      OptionType(PersonType),
      arguments = Argument("name", StringType) :: Nil,
      resolve = ctx => ctx.ctx.getPersonByName(ctx.arg("name")),
      description = Some("A single person"))))
      
def futureFriends(name: String)(implicit ec: ExecutionContext) =
  Future {
    Seq(
      Person("Robert", 33),
      Person("Jenni", 56),
      Person("Fiona", 24)
    )
  }
```

In this code, we define an additional field on the `PersonType` GraphQL object type, `friends`. This field is a collection of `Person` object types, representing zero or more friends. We use the `AddFields` function to add the new Field to the `PersonType`. We set the `resolve` function to fetch the friends asynchronously using the `futureFriends` function and the `value.name` argument obtained from the current context.

We also modify the `QueryType` to add an argument `name` to the `person` field. We use the `ctx` parameter to obtain the `PersonRepo` object, which is responsible for fetching the data from the data source.

In this example, we define a simple `PersonRepo` trait with a `getPersonByName` function, which takes a `name` argument and returns a `Person` object. The `PersonRepo` can be any data source, such as a database, web service, or in-memory cache.


## Query execution and response formatting

The final stage of building a GraphQL API is executing GraphQL queries and formatting the responses. Sangria provides a way to execute GraphQL queries and format the response in an easy and concise way.

```scala
import sangria.execution._
import sangria.execution.deferred._

val Query =
  graphql"""
    query PersonQuery($$name: String!) {
      person(name: $$name) {
        name
        age
        friends {
          name
          age
        }
      }
    }
  """

val result: Future[ExecutionResult[Unit, JsValue]] =
  Executor.execute(schema, Query,
    userContext = new PersonRepo,
    deferredResolver = DeferredResolver.fetchers(SimpleFetcher.deferredFetcher))
    
println(result)
```
In this code, we define a GraphQL query, `PersonQuery`, which asks for a person by name and returns their name, age, and friends, in plain JSON format.

We then execute the query using the `Executor.execute` function, passing the `schema`, `Query`, `PersonRepo` as the user context, and the `DeferredResolver` configuration to fetch data asynchronously.

The `DeferredResolver` configuration ensures that the execution engine handles batched requests efficiently and resolves circular dependencies correctly. We then print the `result` object to the console.

## Conclusion

GraphQL is a powerful data retrieval and manipulation language, and Sangria is an excellent option for building high-performance and scalable GraphQL APIs in Scala. By building a GraphQL API with Sangria, you can leverage the full range of Scala features while seamlessly integrating with any data source that you use.

With Sangria, the process of building a GraphQL API becomes a joy. By keeping our data source separate from the GraphQL schema, we achieved a clean, modular code structure that is easy to maintain and extend. The result is a highly scalable and performant GraphQL API that meets the most stringent business requirements.