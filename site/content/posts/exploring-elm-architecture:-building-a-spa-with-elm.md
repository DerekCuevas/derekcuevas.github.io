---
title: "Exploring Elm Architecture: Building a SPA with Elm"
date: 2023-09-12T01:24:49.476Z
tags: ["elm","single page application","functional programming"]
authors: ["gpt-4"]
---


## Introduction

Elm is a delightful language for building reliable web applications with a strict structure and interactive model-view-update (MVU) implementation. This post will provide a comprehensive exploration of the Elm architecture through the development of a simple single page application (SPA). We will delve into the details of the MVU pattern, commands, subscriptions, and general best practices when using Elm.

## What is Elm Architecture?

Elm architecture follows a simple paradigm of adopting a unique MVU pattern. This pattern implies every application built with Elm will break down its logic into three distinct segments:

- **Model:** This sector manages the state of your application. The model signifies the values and data types which portray the status of the application at a given time.
- **View:** This segment takes the current state and transforms it into HTML that can be displayed on a web browser.
- **Update:** This handles your application’s change in state over time. This function runs every time an event is triggered, adjusting the model which leads to the modification of the view.

With this flowing cycle, we have an Elm application that is predictable and easy to maintain.

## Building a SPA with Elm

Consider the following simple SPA. We will create a SPA that allows the user to navigate between home, about, and contact pages. Here's how we can start:

```elm
import Browser
import Html exposing (Html, div, span, text, button, onClick)
import Browser.Navigation as Nav

type Page = Home | About | Contact

type alias Model =
  { page : Page
  }

init : () -> (Model, Cmd Msg)
init _ =
  let
    url = Nav.pushUrl "home"
  in
  { page = Home } ! [ pushUrl ]

type Msg = NavChange Route | ClickedAbout | ClickedContact

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    NavChange route ->
      case route of
        Home ->
          ( { model | page = Home }, Cmd.none )
        
        About ->
          ( { model | page = About }, Cmd.none )

        Contact -> 
          ( { model | page = Contact }, Cmd.none )

    ClickedAbout ->
      let url = Nav.pushUrl "#/about"
      in
      (model, url)

    ClickedContact ->
      let url = Nav.pushUrl "#/contact"
      in
      (model, url)

view : Model -> Html Msg
view model =
  div []
    [ div [] [ text (toString model.page) ]
    , button [ onClick ClickedAbout ] [ text "About" ]
    , button [ onClick ClickedContact ] [ text "Contact" ]
    ]

main = 
  Browser.document 
    { init = init
    , update = update
    , view = view
    , subscriptions = \_ -> Sub.none
    }
```

Our set up is quite simple:

- `Model` maintains the state of our application.
- `Msg` handles our application’s navigation changes.
- `Page` keeps track of the possible pages of our application.
- `update` function changes the state of our Model when a new message arrives.
- `view` takes our model and renders our pages along with navigation buttons.

## Conclusion

Elm architecture provides a straightforward, manageable, and predictable way of building web applications with a single source of truth - the model. This MVU pattern goes hand-in-hand with the functional programming paradigm and fits graciously with the language features and design of Elm. Adopting such architecture in Elm, especially for SPAs, ensures maintainable and pleasant application development.
