---
title: "Writing High-Performance Networked Applications in Elixir with Erlang Term Storage"
date: 2023-05-25T06:01:58.019Z
tags: ["elixir","erlang term storage","realtime systems","distributed systems","networking"]
authors: ["gpt-3.5-turbo-0301"]
---


Elixir is a highly scalable programming language that excels at building realtime, distributed systems. One of the key strengths of Elixir comes from its use of the Erlang virtual machine, which has a built-in key-value store called Erlang Term Storage (ETS). ETS is a powerful tool for building high-performance networked applications in Elixir. In this article, we will explore the use of ETS in Elixir and its applications in building networked applications.

## What is Erlang Term Storage

Erlang Term Storage is a built-in key-value storage mechanism in the Erlang virtual machine. It is a persistent, distributed storage system that can be used to store large amounts of data in memory. ETS provides a fast, efficient way to store data that can be accessed from multiple processes in a highly concurrent environment.

An ETS table is created by calling the ETS `new` function. The function takes a name, a set of options, and a list of tuples that define the schema of the table.

```elixir
:ets.new(:my_table, [:named_table, :set, :public])
```

Here we create a new ETS table called my_table with options. The options list specifies that the table should be named, be a set, and be public.

ETS tables can be accessed from anywhere in an Elixir or Erlang program using the table's name and key.

## Using Erlang Term Storage for Networking

Erlang Term Storage can be a valuable tool for building networked applications in Elixir. When building a networked application, it is often important to be able to store data that can be accessed from multiple processes. ETS provides a simple, efficient way to do this.

Suppose, for example, that we are building a chat application in Elixir. We might use an ETS table to store the list of users who are currently connected to the chat server. The list of users can be stored as a set of tuples, where each tuple contains the user's name and the process ID of the process that is handling the user's connection to the chat server.

```elixir
:ets.new(:connected_users, [:named_table, :set, :public])

user1_pid = spawn_link(fn -> handle_user_connection(name1, socket1) end)
user2_pid = spawn_link(fn -> handle_user_connection(name2, socket2) end)
...
:ets.insert(:connected_users, {name1, user1_pid})
:ets.insert(:connected_users, {name2, user2_pid})
...
```

Here, we create a new ETS table called `connected_users` that stores the names and process IDs of connected users. We then spawn two new processes, passing in the user's name and socket for each. Finally, we insert the user and process IDs into the `connected_users` ETS table.

Having this information in an ETS table allows us to access it from any process in the chat server. This makes it easy to write code that depends on this data, such as broadcasting messages to connected users or sending private messages between users.

## Conclusion

In this article, we explored how ETS can be used to build high-performance networked applications in Elixir. ETS provides a simple, efficient way to store data that can be accessed from multiple processes in a highly concurrent environment. By leveraging the power of Erlang Term Storage, we can write performant, distributed applications that are easy to reason about and maintain.