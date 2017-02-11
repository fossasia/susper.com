# @ngrx/router-store
### Bindings to connect angular/router to ngrx/store


### Installation

  ```
  npm install @ngrx/router-store --save
  ```

### Setup

1. Use the `routerReducer` when providing the `StoreModule.provideStore` and add the `RouterStoreModule.connectRouter` to the `@NgModule.imports`:

  ```ts
  import { StoreModule } from '@ngrx/store';
  import { routerReducer, RouterStoreModule } from '@ngrx/router-store';

  @NgModule({
    imports: [
      BrowserModule,
      StoreModule.provideStore({ router: routerReducer }),
      RouterStoreModule.connectRouter()
    ],
    bootstrap: [ AppComponent ]
  })
  export class AppModule {
  }
  ```

2. Add `RouterState` to main application state:

  ```ts
  import { RouterState } from '@ngrx/router-store';

  export interface AppState {
    router: RouterState;
  };
  ```

3. (Optional) Set the initial value for the router state:

  ```ts
  StoreModule.provideStore({ router: routerReducer }, {
    router: {
      path: window.location.pathname + window.location.search
    }
  })
  ```

### Dispatching Actions

  ```ts
  import { go, replace, search, show, back, forward } from '@ngrx/router-store';
  ```

#### Navigation with a new state into history

  ```ts
  store.dispatch(go(['/path', { routeParam: 1 }], { query: 'string' }));
  ```

#### Navigation with replacing the current state in history

  ```ts
  store.dispatch(replace(['/path'], { query: 'string' }));
  ```
#### Navigation without pushing a new state into history

  ```ts
  store.dispatch(show(['/path'], { query: 'string' }));
  ```

#### Navigation with only changing query parameters

  ```ts
  store.dispatch(search({ query: 'string' }));
  ```

#### Navigating back

  ```ts
  store.dispatch(back());
  ```

#### Navigating forward

  ```ts
  store.dispatch(forward());
  ```

### Navigation Extras

The [Angular Router Navigation Extras](https://angular.io/docs/ts/latest/api/router/index/NavigationExtras-interface.html) are supported with each router action.

```ts
import { NavigationExtras } from '@angular/router';

let extras: NavigationExtras = {
  relativeTo: ActivatedRoute,
  fragment: string,
  preserveQueryParams: boolean,
  preserveFragment: boolean,
  skipLocationChange: boolean,
  replaceUrl: boolean
};

store.dispatch(go(['path', { routeParam: 1 }], { query: 'string' }, extras));
```
