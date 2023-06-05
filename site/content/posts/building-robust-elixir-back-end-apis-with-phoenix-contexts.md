---
title: "Building Robust Elixir Back-End APIs with Phoenix Contexts"
date: 2023-06-05T00:06:10.627Z
tags: ["elixir","phoenix","api design"]
---


# Introduction
When building back-end APIs with Elixir and Phoenix, it is important to not only ensure the correctness of the responses but also to make the code easily maintainable and organized. Phoenix is a powerful web framework that provides a robust structure for web applications and APIs, but it can get messy and confusing if not organized properly. In this post, we will explore how to write clean and organized code with Phoenix Contexts, by following the Single Responsibility Principle (SRP) and the Open-Closed Principle (OCP).

# Background
Phoenix uses a term called `Contexts`, which allows the grouping of functionality into modules, and creates clear boundaries between concerns. Each context is responsible for a single domain of the application and contains all the necessary logic for that domain. By grouping related functionality together, we can ensure that the code is easy to read, testable and maintainable.

# The Problem
One of the common problems while building an API with Phoenix is that endpoints can get overcrowded, with multiple concerns in a single file. This makes code management and maintenance difficult. Let us take the following example:

```elixir
defmodule MyApp.Web.UserController do
  use MyApp.Web, :controller

  def index(conn, _params) do
    users = MyApp.User.list_users()
    render(conn, "index.json", users: users)
  end

  def create(conn, %{"user" => user_params}) do
    changeset = MyApp.User.registration_changeset(%User{}, user_params)

    case MyApp.Users.create_user(changeset) do
      {:ok, user} ->
        conn
        |> put_status(:created)
        |> put_resp_header("location", Routes.user_path(conn, :show, user))
        |> render("show.json", user: user)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(Phoenix.ChangesetView, "error.json", changeset: changeset)
    end
  end
  
  def update(conn, %{"id" => id, "user" => user_params}) do
    user = MyApp.User.get_user!(id)
    changeset = MyApp.User.registration_changeset(user, user_params)

    case MyApp.User.update_user(changeset) do
      {:ok, user} ->
        conn
        |> put_status(:ok)
        |> render("show.json", user: user)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(Phoenix.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    user = MyApp.User.get_user!(id)
    MyApp.User.delete_user(user)
    conn |> put_status(:no_content) |> send_resp(%{})
  end
end
```

In the above code, we can see that `UserController` is responsible for user-related endpoints, and contains `index`, `create`, `update`, and `delete` actions. This module also has business logic code for `Users`. In the real world application, it would be impossible to keep things this simplified with more business logic and relationships.

# The Solution: Phoenix Contexts
Phoenix Contexts help to keep all the business logic and functionality in one place, ensuring that each context contains all the necessary logic for its domain, defined as a module. A context should contain the CRUD functions for domain entities, which conceals the knowledge of the persistence layer from the web layer. 

Let's explain how to implement contexts by walking through an example. Let's assume we are building a social networking app and want to only focus on the user-related functionality. We would create a new context module called `MyApp.User` to cleanly incorporate all user-related functions. Within that module, we can create a new file `user.ex` which defines a context module as follows:

```elixir
defmodule MyApp.User do
  alias MyApp.Repo
  alias MyApp.User

  def list_users() do
    Repo.all(User)
  end

  def create_user(attrs \\ %{}) do
    %User{}
    |> User.changeset(attrs)
    |> Repo.insert()
  end

  def update_user(%User{} = user, attrs) do
    user
    |> User.changeset(attrs)
    |> Repo.update()
  end

  def delete_user(%User{} = user) do
    Repo.delete(user)
  end
end
```

In the above definition of the `MyApp.User` context, we define functions for different user-related functionality. `list_users/0` lists all the users in the database, and `create_user/1` creates a user from specified attributes. `update_user/2` function is used to update an existing user, while `delete_user/1` takes in a user and removes it from the database. 

# Using the Context in the Controller
Now instead of defining the functions in `UserController` we can use `MyApp.User` module in the controller as follows:

```elixir
defmodule MyApp.Web.UserController do
  use MyApp.Web, :controller
  alias MyApp.User

  def index(conn, _params) do
    users = User.list_users()
    render(conn, "index.json", users: users)
  end

  def create(conn, %{"user" => user_params}) do
    case User.create_user(user_params) do
      {:ok, user} ->
        conn
        |> put_status(:created)
        |> put_resp_header("location", Routes.user_path(conn, :show, user))
        |> render("show.json", user: user)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render("error.json", message: "Failed to create user")
    end
  end
  
  def update(conn, %{"id" => id, "user" => user_params}) do
    user = User.get_user!(id)
    
    case User.update_user(user, user_params) do
      {:ok, user} ->
        conn
        |> put_status(:ok)
        |> render("show.json", user: user)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render("error.json", message: "Failed to update user")
    end
  end

  def delete(conn, %{"id" => id}) do
    user = User.get_user!(id)
    User.delete_user(user)
    conn |> put_status(:no_content) |> send_resp(%{})
  end
end
```
As we can see, the controller has been simplified quite a bit, and the Web layer has no knowledge of how the user is stored in the persistence layer. This is achieved via the context's function defined in the above modules. By abstracting the persistence layer, we can change the database structure without affecting the Web Layer.

# Conclusion
Phoenix Contexts is a powerful, yet simple way to build maintainable and organized APIs when working with the Phoenix framework. By closely following the Single Responsibility Principle, and the Open-Closed Principle, we can ensure a high degree of modularity, reusability, and testability. If you're building a large Phoenix application or API, we highly recommend giving Phoenix Contexts a try.