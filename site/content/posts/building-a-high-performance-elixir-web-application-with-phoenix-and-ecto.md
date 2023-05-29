---
title: "Building a High-Performance Elixir Web Application with Phoenix and Ecto"
date: 2023-05-29T00:05:30.608Z
tags: ["elixir","phoenix","ecto"]
---


Elixir is a dynamic, functional programming language designed for building massively scalable and reliable web applications. Developed on top of the Erlang virtual machine, Elixir combines the flexibility of Ruby with the efficiency of Erlang to provide a high-performance and scalable platform for building distributed and concurrent systems. 

In this tutorial, we will build a simple web application using the Elixir's popular Phoenix framework and the Ecto library to showcase how to create a fast and scalable web application with Elixir.

## Prerequisites

- Basic knowledge of Elixir programming language.
- Familiarity with Phoenix web framework.
- Basic knowledge of PostgreSQL or other relational database systems.
- A code editor (e.g. VSCode, Atom).

## Setting Up the Project

- First, we need to install Elixir and Phoenix. We can install it by running `mix archive.install hex phx_new`.

- Once Phoenix is installed, we can use it to create a new project by running the following command:

  ```
  mix phx.new my_project --no-ecto
  ```

- This command creates a new Phoenix project named "my_project" without the Ecto library, which is Phoenix's database wrapper. We will add it later, since the focus of this tutorial is on building a high performance web application with Phoenix.

- Generate a new Phoenix controller:

  ```
  mix phx.gen.html User Users name:string age:integer
  ```

- This command generates a User controller with a User model and some basic CRUD actions for dealing with users. It also generates a database migration file for creating the Users table in the database, which we will use later. 

- Next, navigate to the newly generated project directory, and run `mix deps.get` to install all required dependencies.

## Creating the User Model

- Let's go ahead and add the Ecto library to our project by uncommenting the `ecto` line in the `mix.exs` files, and running `mix deps.get` again.

- Create a new file called `user.ex` in the `lib/my_project` directory:

  ```elixir
  defmodule MyProject.User do
    use Ecto.Schema

    schema "users" do
      field :name, :string
      field :age, :integer
    end
  end
  ```

- This file defines a User schema with two fields: `name` and `age`. 

- Next, we need to create the Users table in the database by running:

  ```
  mix ecto.create
  mix ecto.migrate
  ```

- The first command creates the database if it does not exist and the second command runs the database migration script `priv/repo/migrations/20220601172548_create_users.exs`, which creates the Users table in the database.

## Building User Controller and Views

- Let's create a User controller with some basic CRUD operations for dealing with users. In the `lib/my_project_web/controllers/user_controller.ex` file add:

  ```elixir
  defmodule MyProjectWeb.UserController do
    use MyProjectWeb, :controller

    alias MyProject.Repo
    alias MyProject.User

    def index(conn, _params) do
      users = Repo.all(User)
      render(conn, "index.html", users: users)
    end

    def show(conn, %{"id" => id}) do
      user = Repo.get(User, id)
      render(conn, "show.html", user: user)
    end

    def new(conn, _params) do
      changeset = User.changeset(%User{})
      render(conn, "new.html", changeset: changeset)
    end

    def create(conn, %{"user" => user_params}) do
      changeset = User.changeset(%User{}, user_params)
      case Repo.insert(changeset) do
        {:ok, user} ->
          conn
          |> put_flash(:success, "User created successfully.")
          |> redirect(to: Routes.user_path(conn, :show, user))
        {:error, changeset} ->
          render(conn, "new.html", changeset: changeset)
      end
    end

    def edit(conn, %{"id" => id}) do
      user = Repo.get!(User, id)
      changeset = User.changeset(user)
      render(conn, "edit.html", user: user, changeset: changeset)
    end

    def update(conn, %{"id" => id, "user" => user_params}) do
      user = Repo.get!(User, id)
      changeset = User.changeset(user, user_params)
      case Repo.update(changeset) do
        {:ok, user} ->
          conn
          |> put_flash(:success, "User updated successfully.")
          |> redirect(to: Routes.user_path(conn, :show, user))
        {:error, changeset} ->
          render(conn, "edit.html", user: user, changeset: changeset)
      end
    end

    def delete(conn, %{"id" => id}) do
      Repo.delete!(Repo.get!(User, id))
      conn
      |> put_flash(:success, "User deleted successfully.")
      |> redirect(to: Routes.user_path(conn, :index))
    end
  end
  ```

- This file defines basic CRUD operations for dealing with users.

- Next, we need to generate user's views for the user controller, run:

  ```
  mix phx.gen.html User Users name:string age:integer
  ```

- This command generates view files for rendering user-specific HTML.

- In the file `lib/my_project_web/views/user_view.ex` add:

  ```elixir
  defmodule MyProjectWeb.UserView do
    use MyProjectWeb, :view

    def render("index.html", %{users: users}) do
      """
      <h1>Users</h1>
      <ul>
      <%= for user <- users do %>
        <li><%= user.name %></li>
      <% end %>
      </ul>

      <%= link("New user", to: Routes.user_path(@conn, :new)) %>
      """
    end

    def render("show.html", %{user: user}) do
      """
      <h1><%= user.name %></h1>

      <%= link("Edit", to: Routes.user_path(@conn, :edit, user)) %>
      <%= link("Delete", to: Routes.user_path(@conn, :delete, user), method: :delete, data: [confirm: "Are you sure?"]) %>
      """
    end

    def render("new.html", %{changeset: changeset}) do
      """
      <h1>New User</h1>

      <%= render "form.html", Map.put(assigns, :action, Routes.user_path(@conn, :create)), changeset: changeset %>
      """
    end

    def render("edit.html", %{user: user, changeset: changeset}) do
      """
      <h1>Edit User</h1>

      <%= render "form.html", Map.put(assigns, :action, Routes.user_path(@conn, :update, user)), changeset: changeset %>
      """
    end

    def render("form.html", %{changeset: changeset}) do
      """
      <%= form_for changeset, @action, fn f -> %>
        <%= text_input f, :name %>
        <%= error_tag f, :name %>

        <%= number_input f, :age %>
        <%= error_tag f, :age %>

        <div class="form-group">
          <%= submit "Save" %>
        </div>
      <% end %>
      """
    end
  end
  ```

- These views use Elixir's built-in templating engine, EEx.

## Starting the Phoenix Server

- Our application is now complete and ready to run. Run it with:

  ```
  mix phx.server
  ```

- The web application should now be up and running on http://localhost:4000.

## Conclusion

- In this tutorial, we have built a high-performance web application with Elixir, Phoenix, and Ecto. Elixir provides a great platform for building fast and scalable web applications, and Phoenix makes it easy to create a web server that can handle a large number of requests concurrently. Ecto makes it easy to work with and query a relational database, and together with Phoenix, it provides a powerful combination for building web applications.