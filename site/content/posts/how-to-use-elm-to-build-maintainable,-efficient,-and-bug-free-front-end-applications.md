---
title: "How to use Elm to build maintainable, efficient, and bug-free front-end applications"
date: 2023-06-07T12:04:39.888Z
tags: ["elm","front-end","best practices"]
---


## Introduction

There are many options to build front-end applications, but Elm stands out from the crowd by providing a robust [functional programming](https://en.wikipedia.org/wiki/Functional_programming) language that enforces strong typing, immutability, and purity. Elm is famous for its maintainability, efficiency, and bug-free code, which is achieved by using its built-in architecture, clear syntax, and extensive libraries. In this post, we'll explore how to leverage the benefits of Elm and build a simple but effective front-end application.

## Setup

Before diving into the details, let's set up an Elm project. First, we need to install the Elm compiler and Elm packages. On Linux and macOS, we can use the following commands:

```bash
$ npm install -g elm
$ elm init
```

These commands will install the Elm compiler and set up an Elm project with a `src` directory and an `elm.json` file. The `elm.json` file lists the project's dependencies and metadata. 

Next, let's create an Elm module to write our application code. In the `src` directory, create a file named `Main.elm`. This file will contain our application code. 

```elm
module Main exposing (main)

import Html exposing (Html, Attribute, button, div, text)
import Html.Attributes exposing (class, onClick)

main : Program () Model Msg
main =
  Html.program
    { init = initialModel
    , update = update
    , view = view
    , subscriptions = \_ -> Sub.none
    }

type alias Model =
  { count : Int
  }

initialModel : Model
initialModel =
  { count = 0
  }

type Msg
  = Increment
  | Decrement

update : Msg -> Model -> Model
update msg model =
  case msg of
    Increment ->
      { model | count = model.count + 1 }

    Decrement ->
      { model | count = model.count - 1 }

view : Model -> Html Msg
view model =
  div []
    [ button [ onClick Decrement ] [ text "-" ]
    , div [] [ text (String.fromInt model.count) ]
    , button [ onClick Increment ] [ text "+" ]
    ]
```

This Elm module defines a simple counter application that has three parts: `Model`, `Msg`, and `view`. The `Model` defines the state of our application, which in this case is an integer counter value. The `Msg` defines the possible events our application can handle, which in this case are incrementing and decrementing the counter. `view` defines the HTML representation of our application and how the Elm virtual DOM should handle user actions.

Once we've saved the `Main.elm` file, we can compile it using the following command:

```bash
$ elm make src/Main.elm --output=elm.js
```

This command will generate a JavaScript file named `elm.js` that we can include in our HTML file to create our application's user interface.

## Architecture

Elm provides a clear and explicit architecture that ensures maintainable and scalable applications. This architecture has three clear parts: `Model`, `Update`, and `View`. 

The `Model` defines the state of the application. It can be simple types, such as `Int`, or complex types such as records or custom types. 

The `Update` function, which accepts a message and a model and returns a new model, updates the model based on that message. 

The `View` function, which takes a model and returns an HTML view, is responsible for rendering our application's user interface. 

Let's dive into these concepts in more detail by building some real-world examples.

## Example: Fetching data from a REST API

One of the most common tasks for front-end applications is fetching data from a REST API. Elm makes this task simple with its built-in HTTP module, which allows us to send HTTP requests using the `Http.send` function.

```elm
type alias Model =
  { users : List User
  , loading : Bool
  }

type User =
  { id : Int
  , name : String
  , email : String
  }

type Msg
  = SetUsers (Result Http.Error (List User))

update : Msg -> Model -> Model
update msg model =
  case msg of
    SetUsers (Ok users) ->
      { model | users = users, loading = False }

    SetUsers (Err _) ->
      { model | loading = False }

fetchUsers : Cmd Msg
fetchUsers =
  Http.send
    SetUsers
    { method = "GET"
    , url = "https://my.api.com/users"
    , headers = []
    , body = Http.emptyBody
    , expect = Http.expectJson (Result.fromJson userDecoder)
    }

userDecoder : Decoder User
userDecoder =
  Decode.map3 User
    (Decode.field "id" Decode.int)
    (Decode.field "name" Decode.string)
    (Decode.field "email" Decode.string)

view : Model -> Html Msg
view model =
  div []
    [ if model.loading
        then text "Loading users..."
        else ul [] (List.map userView model.users)
      , button [ onClick fetchUsers ] [ text "Fetch users" ]
    ]

userView : User -> Html Msg
userView user =
  li [] [ text user.name ]
```

This Elm module defines an application that fetches a list of users from a REST API and displays them. It consists of a `Model` record with a list of users and a `loading` flag. The `Update` function has a single message `SetUsers` that is responsible for updating the `users` and `loading` fields of the model based on the HTTP response. The `fetchUsers` function is responsible for sending an HTTP request and mapping the response to a `User` list using a JSON decoder. The `View` function checks whether the application is loading data and, if so, displays a loading message; otherwise, it displays a list of users and a button to fetch the data.

## Example: Enhancing interface with third-party libraries

Elm has an extensive and growing library ecosystem that provides a wide range of functionality, from UI components to data visualization tools. One of the most popular libraries, [elm-ui](https://package.elm-lang.org/packages/mdgriffith/elm-ui/latest), provides a modern and declarative way to build responsive layouts.

```elm
module Main exposing (main)

import Browser
import Element exposing (Element, el, text, width, height, Font)
import Element.Background as Background
import Element.Border as Border
import Element.Font as Font
import Element.Input as Input
import Element.Shadow as Shadow
import Html exposing (Html)
import Html.Events exposing (onInput)
import Json.Decode as Decode

type alias Model =
  { input : String
  }

type Msg
  = SetInput String

main : Program () Model Msg
main =
  Browser.sandbox
    { init = initialModel
    , update = update
    , view = view
    }

initialModel : Model
initialModel =
  { input = ""
  }

update : Msg -> Model -> Model
update msg model =
  case msg of
    SetInput input ->
      { model | input = input }

view : Model -> Html Msg
view model =
  let
    inputElement =
      Input.text
        [ value model.input
        , onInput SetInput
        ]

    inputWithStyle =
      el [ width (em 16), height (em 2), Border.rounded (em 0.25), Background.gray ]
        [ el [ Shadow.standard, padding (em 0.5), Background.white ] [ inputElement ] ]

    headerWithStyle =
      el [ width (em 16), Font.bold, text "Enter your name below:" ]

    paragraphWithStyle =
      el [ width (em 16), padding (em 0.5), text "Welcome to my application. This is an example of how to use the elm-ui library." ]
  in
    Element.center
      [ headerWithStyle
      , paragraphWithStyle
      , inputWithStyle
      ]
```

This Elm module defines an application that displays a header, a paragraph, and a stylish input field. It uses the `elm-ui` library to create the input field, which is a combination of many different CSS rules. The `inputWithStyle` element has a gray background, white text, rounded corners, and a drop shadow. The `headerWithStyle` and `paragraphWithStyle` elements have bold text, and the paragraph element has some padding to separate it from the input field.

## Conclusion

Elm is a mature and reliable front-end programming language that provides many benefits for building maintainable, scalable, and efficient applications. It has a clear architecture, modern syntax, and extensive libraries that make it easy to write bug-free code. With Elm, you can build professional front-end applications with less effort, fewer bugs, and more fun. Give it a try!