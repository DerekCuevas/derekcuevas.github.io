---
title: "Building Composable, Scalable, and Reusable Redux Reducers"
date: 2023-06-03T00:05:35.396Z
tags: ["redux","react","javascript"]
authors: ["gpt-3.5-turbo-0301"]
---


## Introduction

Redux, the popular state management library for React applications, is famous for its unidirectional data flow, immutable state, and predictable updates. One of the core concepts of Redux is a reducer, a pure function that receives the current state and an action, and returns the next state. A reducer is standalone, testable, and composable, which makes it a perfect tool for managing complex application states.

However, building reducers is not always a trivial task. As applications grow, so does the complexity of states and interactions between them. Reducers can become entangled, monolithic, and hard to test. In this post, we will explore how to build composable, scalable, and reusable reducers that make managing states in complex applications a breeze.

## What Makes a Good Reducer?

A good reducer should have the following properties:

- **Pure:** A reducer should not modify the current state or any of its arguments. It should always return a new state object.
- **Deterministic:** A reducer should always return the same result given the same input. It should not have any side effects, such as changing the network, or reading from the DOM.
- **Composable:** A reducer should be standalone and testable, but it should also be easy to compose with other reducers to form a larger reducer that manages a more complex state.
- **Scalable:** A reducer should be able to handle a large number of states and interactions between them without becoming too complex or unmanageable.
- **Reusable:** A reducer should be reusable in different parts of the application, or in different applications.

## Composition Patterns

There are several composition patterns for reducers that make it easy to compose them into larger reducers. We will explore three of them:

### Splitting Reduction Logic into Multiple Functions

Splitting up the reduction logic into several functions that handle different parts of the state is a simple way to compose reducers. Each function is responsible for reducing a specific substate, and the final reducer combines all of them to form the complete state.

```javascript
function todos(state = [], action) {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        {
          id: action.id,
          text: action.text,
          completed: false
        }
      ];
    case 'TOGGLE_TODO':
      return state.map(todo =>
        todo.id === action.id ? { ...todo, completed: !todo.completed } : todo
      );
    default:
      return state;
  }
}

function visibilityFilter(state = 'SHOW_ALL', action) {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter;
    default:
      return state;
  }
}

function todosApp(state = {}, action) {
  return {
    todos: todos(state.todos, action),
    visibilityFilter: visibilityFilter(state.visibilityFilter, action)
  };
}
```

In this example, the todos reducer handles the todos substate, the visibilityFilter reducer handles the visibilityFilter substate, and the todosApp reducer combines them both into a single root reducer that can be passed to the Redux createStore function.

### Using Higher-Order Reducers

Higher-order reducers are reducers that take one or more reducers as arguments and return a new reducer. They are useful for adding common functionality, such as logging, to multiple reducers.

```javascript
function withLogging(reducer) {
  return (state, action) => {
    console.log(`Action ${action.type} was dispatched with state`, state);
    const newState = reducer(state, action);
    console.log(`Action resulted in state`, newState);
    return newState;
  };
}
```

In this example, withLogging is a higher-order reducer that takes a reducer as an argument and returns a new reducer that logs the current state and the resulting state for each dispatched action.

### Using combineReducers

The combineReducers utility function provided by Redux is a simple way to combine multiple reducers into a single root reducer. It takes an object whose values are reducers, and returns a new reducer that maps the corresponding keys to the result of invoking the reducers with their respective state slices.

```javascript
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
  todos: todosReducer,
  visibilityFilter: visibilityFilterReducer
});
```

In this example, todosReducer and visibilityFilterReducer are reducers that handle the todos and visibilityFilter substates, respectively. The combineReducers function returns a new root reducer that can be passed to createStore.

## Conclusion

Building composable, scalable, and reusable reducers is essential for managing complex application states. By splitting up reduction logic into multiple functions, using higher-order reducers, and combining reducers using combineReducers, we can achieve reducers that are easier to test, maintain, and extend. Remember to keep reducers pure, deterministic, and easy to compose.