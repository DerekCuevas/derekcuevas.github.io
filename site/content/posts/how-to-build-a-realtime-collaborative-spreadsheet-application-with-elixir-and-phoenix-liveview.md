---
title: "How to Build a Realtime Collaborative Spreadsheet Application with Elixir and Phoenix LiveView"
date: 2023-06-05T18:05:17.334Z
tags: ["elixir","phoenix liveview","realtime systems"]
---


As web applications become increasingly interactive, handling real-time updates and non-blocking input/output has become a crucial aspect of web development. Elixir, a functional programming language built on top of the Erlang virtual machine, and the Phoenix web framework provide developers with a powerful toolset to build scalable, fault-tolerant, and high-performance web applications able to handle thousands of concurrent connections and chatrooms, vote systems, realtime games, message queues and any system where is near impossible or highly cumbersome to perform full reloads for each user update.

In this post, we will demonstrate how to leverage Elixir and Phoenix LiveView to build a real-time collaborative spreadsheet application. First, we will discuss the background and theory behind Elixir and Phoenix LiveView, including how LiveView works under the hood to provide real-time features. Then, we will explore how to use LiveView in practice, building a basic spreadsheet application using Phoenix and Elixir.

## Background

Elixir is a functional programming language that is designed for performant, scalable, fault-tolerant systems. Elixir takes advantage of Erlang's virtual machine and programming model to provide a platform for building distributed systems. Elixir syntax is similar to Ruby, making it an approachable language to learn, and provides excellent documentation for developers of all skill levels. 

Phoenix is a web framework for Elixir that uses the same principles as Elixir to provide fault-tolerance and scalability to web applications. Phoenix provides tools for handling many concurrent connections, websockets, authentication, and many other features that make it a formidable competitor in the web development space. Phoenix LiveView is a real-time feature for Phoenix that came out in 2019. LiveView takes Elixir's concurrency features and combines them with a reactive programming model to provide an easy way to build real-time features.

## Working with Phoenix LiveView

Phoenix LiveView offers developers the ability to build real-time web applications without the need to write any client-side JavaScript code. Instead of using JavaScript, LiveView leverages the power of Elixir and a reactive programming model to provide real-time updates to the DOM. 

As you know, HTML is a static format, and changes can only be made to the DOM by manipulating its underlying JavaScript representation, the Document Object Model. DOM manipulation in JavaScript is a low-level, highly manual task that can be very error-prone and hard to debug. LiveView eliminates the need for manual DOM manipulation. 

LiveView operates by sending a payload of predetermined data from the server to the client, and then manipulating the DOM based on the data received. Through the use of a dedicated connection, LiveView sends and receives messages from the server that update the data model and, consequently, the page's rendering.

## Building a Realtime Collaborative Spreadsheet Application

For our sample application, we will create a basic spreadsheet with some real-time collaboration features. Several users will be able to view and edit the spreadsheet simultaneously, and any changes made by one user are immediately reflected in all of the other users' views.

First, let's create the Phoenix application.

We will assume basic knowledge of Elixir and Phoenix framework installation.

```bash
mix phx.new realtime_spreadsheet --no-ecto --live
```

We pass the `--no-ecto` flag as we don't plan to use a database.

Once the application is generated, let's launch the server with:

```bash
cd realtime_spreadsheet
mix phx.server
```

If everything went well, we should be able to navigate to `http://localhost:4000/` in our web browser, where Phoenix is greeting us with a "Welcome to Phoenix LiveView!" message.

### Creating the Spreadsheet Model and View

In Phoenix, a LiveView component is a self-contained unit that can have its own state and UI. We will create a `Spreadsheet` component to handle our spreadsheet.

Let's first define the initial state of the spreadsheet. We will create a module under `lib/realtime_spreadsheet/spreadsheet.ex`.

```elixir
defmodule RealtimeSpreadsheet.Spreadsheet do
  defstruct spreadsheet_data: %{},
            rows: 10, 
            cols: 10

  def new() do
    %__MODULE__{}
  end
end
```

We initialize the `spreadsheet_data` map to be empty, with the number of rows and columns as specified.

Now let's generate the LiveView component. We will create a component under `lib/realtime_spreadsheet_web/live/` directory.

```bash
cd lib/realtime_spreadsheet_web/live/
mix phx.gen.live Spreadsheet
res # this command generates the Spreadsheet component
```

This command will generate a simple LiveView component that displays the message "This is the Spreadsheet LiveView". We will modify it to display the actual spreadsheet instead.

```elixir
defmodule RealtimeSpreadsheetWeb.SpreadsheetLive do
  use Phoenix.LiveView

  # Static assigns used by render and template tags
  @impl true
  def render(assigns) do
    ~L"""
    <h1>Spreadsheet</h1>
    <table>
      <%= for i <- 1..@rows do %>
        <tr>
          <%= for j <- 1..@cols do %>
            <td>
              <%=
              # TODO: Put the content of each cell here
              "" %>
            </td>
          <% end %>
        </tr>
      <% end %>
    </table>
    """
  end

  def mount(_params, _session, socket) do
    {:ok, assign(socket, rows: 10, cols: 10)}
  end
end
```

### Displaying the Spreadsheet

Now we need to tell Phoenix to display our `Spreadsheet` component. Open the `lib/realtime_spreadsheet_web/router.ex` file and add the following:

```elixir
defmodule RealtimeSpreadsheetWeb.Router do
  use RealtimeSpreadsheetWeb, :router

  #...

  scope "/", RealtimeSpreadsheetWeb do
    pipe_through [:browser]

    live "/", SpreadsheetLive
  end
end
```

Restart the server and navigate to `http://localhost:4000/`. If everything has gone well, you should see a table with 10 rows and 10 columns displayed.

The cells in the spreadsheet are currently empty, so next, we will add the functionality for displaying cell values.

### Displaying Cell Values

We will need to modify the spreadsheet's state to provide cell and row data.

```elixir
defmodule RealtimeSpreadsheet.Spreadsheet do
  defstruct spreadsheet_data: %{},
            rows: 10, 
            cols: 10

  def cell_value(%{row: row, col: col} = cell) do
    Map.get(cell.spreadsheet_data, {row, col}, "")
  end

  def row_values(spreadsheet, row) do
    for col <- 1..spreadsheet.cols, into: [] do
      spreadsheet |> cell_value(%{row: row, col: col})
    end
  end
end
```

We have defined two functions that retrieve cell and row data from `spreadsheet_data`. 

Now we need to update the `SpreadsheetLive` module to use the data provided by the spreadsheet component.

```elixir
defmodule RealtimeSpreadsheetWeb.SpreadsheetLive do
  use Phoenix.LiveView

  # ...

  def render(assigns) do
    {rows, cols} = assigns

    ~L"""
    <h1>Spreadsheet</h1>
    <table>
      <%= for i <- 1..@rows do %>
        <tr>
          <%= for j <- 1..@cols do %>
            <td>
              <%= @spreadsheet.row_values(i) |> Enum.at(j) %>
            </td>
          <% end %>
        </tr>
      <% end %>
    </table>
    """
  end

  def mount(_params, _session, socket) do
    {:ok, assign(socket, spreadsheet: Spreadsheet.new(), rows: 10, cols: 10)}
  end
end
```

We include a call to `Spreadsheet.new()` in the `mount` function to instantiate a new `Spreadsheet` instance, and then we pass it to our assigns. 

When we navigate to our application, we should now see the empty cells in the spreadsheet.

Next, we will add the ability to edit individual cells.

### Modifying Cell Values

We will now add an event to our LiveView that listens for user input events in the cells. When the user edits a cell, the value is updated in the spreadsheet and propagated to all other clients.

```elixir
defmodule RealtimeSpreadsheetWeb.SpreadsheetLive do
  use Phoenix.LiveView

  # ...

  def mount(_params, _session, socket) do
    {:ok, assign(socket, spreadsheet: Spreadsheet.new(), rows: 10, cols: 10)}
  end

  def handle_event("cell_edited", %{"row" => row_str, "col" => col_str, "value" => value}, socket) do
    row = String.to_integer(row_str)
    col = String.to_integer(col_str)

    Spreadsheet.update_cell(socket.assigns.spreadsheet, row, col, value)

    {:noreply, socket}
  end

  def render(assigns) do
    {rows, cols} = assigns

    ~L"""
    <h1>Spreadsheet</h1>
    <table>
      <%= for i <- 1..@rows do %>
        <tr>
          <%= for j <- 1..@cols do %>
            <td>
              <div class="cell" phx-key="<%= i %>x<%= j %>"
                   phx-click="cell_clicked"
                   phx-value-row="<%= i %>"
                   phx-value-col="<%= j %>">
                <%= @spreadsheet.row_values(i) |> Enum.at(j) %>
              </div>
            </td>
          <% end %>
        </tr>
      <% end %>
    </table>
    """
  end
end
```

We define the function `handle_event` to listen for a cell edited event. Then, in the `render` function, we add a `div` element with a click event to each cell. We pass the row and column of the clicked cell as payload.

Lastly, we add a function `Spreadsheet.update_cell` to update the `spreadsheet_data` map with the new value.

```elixir
defmodule RealtimeSpreadsheet.Spreadsheet do
  #...

  def update_cell(spreadsheet, row, col, value) do
    updated_values = Map.put(spreadsheet.spreadsheet_data, {row, col}, value)
    %{spreadsheet | spreadsheet_data: updated_values}
  end
end
```

### Displaying Changes to Other Users

When a user edits a cell, we need to propagate the change to all connected clients. We can do this very easily in Phoenix LiveView with just a few lines of code.

Our `SpreadsheetLive` component already has an automatically created channel with a topic that is based on the URL path of the LiveView component. This channel is used to propagate events from the server to all connected clients for that specific LiveView component.

We need to modify our handle_event function to broadcast the cell edited event to all connected clients through this channel.

```elixir
defmodule RealtimeSpreadsheetWeb.SpreadsheetLive do
  use Phoenix.LiveView

  #...

  def handle_event("cell_edited", %{"row" => row_str, "col" => col_str, "value" => value}, socket) do
    row = String.to_integer(row_str)
    col = String.to_integer(col_str)

    spreadsheet = Spreadsheet.update_cell(socket.assigns.spreadsheet, row, col, value)

    {:noreply, socket |> assign(spreadsheet: spreadsheet) |> push_event("cell_edited", %{ row: row, col: col, value: value })}
  end
end
```

We call the `push_event` function with the payload to broadcast the `cell_edited` event to all connected clients.

### Conclusion

In this post, we have seen how Elixir and Phoenix LiveView can be used to build real-time web applications with very little client-side code. We built a real-time collaborative spreadsheet application as an example, but LiveView can be used for any number of use cases that require real-time updates. Thanks to Elixir's concurrency model, we can achieve these real-time updates without the usual performance costs of websockets and manual DOM rendering updates. With Phoenix LiveView, Elixir provides a powerful toolset for building highly concurrent, reactive web applications.