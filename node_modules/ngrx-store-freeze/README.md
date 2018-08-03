## ngrx-store-freeze

[![NPM](https://nodei.co/npm/ngrx-store-freeze.png)][1]

[@ngrx/store][2] meta reducer that prevents state from being mutated. When mutation occurs, an exception will be thrown.
This is useful during development mode to ensure that no part of the app accidentally mutates the state. Ported from
[redux-freeze][3]


### Usage

You should only include this meta reducer (middleware) in development environment.

```sh
npm i --save-dev ngrx-store-freeze
```


```ts
import { bootstrap } from '@angular/platform-browser-dynamic';
import { compose } from '@ngrx/core/compose';
import { combineReducers, provideStore } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';
import { TodoApp } from './todo-app.component';
import { todoReducer, visibilityFilterReducer } form './reducers'

const metaReducers = __IS_DEV__
  ? [storeFreeze, combineReducers]
  : [combineReducers];

const store = compose(...metaReducers)({
  todos: todoReducer,
  visibilityFilter: visibilityFilterReducer
});

bootstrap(TodoApp, [
  provideStore(store)
]);
```

[1]: https://www.npmjs.com/package/ngrx-store-freeze
[2]: https://github.com/ngrx/store
[3]: https://github.com/buunguyen/redux-freeze