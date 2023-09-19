---
title: "A Deep Dive into ngrx/effects: An Angular Side Effect Model"
date: 2023-09-19T01:27:30.992Z
tags: ["angular","ngrx/effects","functional programming"]
authors: ["gpt-4"]
---

In today's post, we'll be taking a comprehensive look at `ngrx/effects`, an Angular library that tackles side effects within applications in a functional, reactive way. We'll dive deep into the technical aspects of this library and see how it uses the Redux pattern in combination with RxJS observables to manage side effects cleanly and effectively.

## Introduction to Side Effects

In functional programming, a side effect is any operation that modifies the state of the software outside of its local environment.

```typescript
let count = 0;

function increment() {
    count++;
}
```

In the above example, `increment` function is causing a side effect by modifying the `count` variable that is outside of the function's scope.

There's a consensus in the software development community that side effects can make programs harder to understand, predict, and debug. So, there's a growing movement towards isolating and controlling side effects within programs. This is where `ngrx/effects` comes into the picture, offering a model for handling side effects in a predictable manner within Angular applications.

## ngrx/effects

`ngrx/effects` is a library that provides APIs to interact with side effects originating from the Angular Components. It follows the Redux pattern, unifying side effects into actions and handling them in a predictable and consistent manner.

Consider a basic example where a button click in an Angular component leads to an HTTP request, a typical side effect, to fetch some data from an API.

```typescript
import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
    selector: 'my-app',
    template: `
        <button (click)="fetchData()">Fetch Data</button>
    `,
})
export class AppComponent {
    constructor(private http: HttpClient) {}

    fetchData() {
        this.http.get('https://api.example.com/data').subscribe(data => {
            console.log(data);
        });
    }
}
```

In the above scenario, we are directly subscribing to the observable returned from the call to HttpClient's `get` method and logging the response data. With `ngrx/effects`, we can handle this side effect in a cleaner and predictable way.

## Integrating ngrx/effects into Angular Applications

Firstly, we need to install the `@ngrx/effects` package via npm.

```bash
npm install @ngrx/effects
```

Now, we'll create an action to represent the button click.

```typescript
import { createAction } from '@ngrx/store';

export const fetchData = createAction('[App Component] Fetch Data');
```

We'll also create actions to handle the success and failure scenarios of the HTTP request.

```typescript
import { createAction, props } from '@ngrx/store';

export const fetchDataSuccess = createAction(
    '[App Component] Fetch Data Success', 
    props<{ data: any }>()
);

export const fetchDataFailure = createAction(
    '[App Component] Fetch Data Failure', 
    props<{ error: any }>()
);
```

We utilize `props` function to include additional information (payload) with the action.

Next, we'll create an effect that listens for the `fetchData` action, makes the HTTP request, and dispatches either the `fetchDataSuccess` or `fetchDataFailure` action depending on the result.

```typescript
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import * as actions from './app.actions';

@Injectable()
export class AppEffects {
    fetchData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(actions.fetchData),
            mergeMap(() => this.http.get('https://api.example.com/data')
                .pipe(
                    map(data => actions.fetchDataSuccess({ data })),
                    catchError(error => actions.fetchDataFailure({ error }))
                )
            )
        )
    );

    constructor(
        private actions$: Actions,
        private http: HttpClient
    ) {}
}
```

Finally, we'll modify the AppComponent to dispatch the `fetchData` action when the button is clicked.

```typescript
import {Component} from '@angular/core';
import { Store } from '@ngrx/store';
import * as actions from './app.actions';

@Component({
    selector: 'my-app',
    template: `
        <button (click)="fetchData()">Fetch Data</button>
    `,
})
export class AppComponent {
    constructor(private store: Store) {}

    fetchData() {
        this.store.dispatch(actions.fetchData());
    }
}
```

This decouples the interaction with the HTTP API from the `AppComponent` and provides clear, explicit declaration of side effects happening in the application.

Notice how ngrx/effects merges the streams of actions into a single, unified model of interactions within the application. This model provides several benefits such as better testability, better state management, and better control over the order of operations.

In conclusion, ngrx/effects provides powerful abstractions to handle side effects in Angular applications, ensuring that effects are isolated and handled in a consistent and predictable manner. By combining actions, reducers, and effects, we can ensure a unidirectional and consistent handling of asynchronous operations in our Angular applications.
