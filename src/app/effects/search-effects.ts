import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { empty } from 'rxjs/observable/empty';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/takeUntil';
import * as query from '../actions/query';
export const CHANGE = 'CHANGE';
import * as fromRoot from '../reducers';
import * as search from '../actions/search';
import {SearchService} from '../services/search.service';

export interface State {
  query: string;
}

/**
 * Effects offer a way to isolate and easily test side-effects within your
 * application. StateUpdates is an observable of the latest state and
 * dispatched action. The `toPayload` helper function returns just
 * the payload of the currently dispatched action, useful in
 * instances where the current state is not necessary.
 *
 * A simple way to think of it is that ngrx/effects is an event listener of sorts.
 * It listens for actions being dispatched to the store. You can then tell `ngrx/effects`
 * that when a particular action is dispatched, to take another, new action as a result.
 * At the end, what’s really happening is `ngrx/effects` is an `action generator` that dispatches
 * a `new action` as a result of a different action.
 */

@Injectable()
export class ApiSearchEffects {

  @Effect()
  search$: Observable<any>
    = this.actions$
    .ofType(query.ActionTypes.QUERYSERVER)
    .debounceTime(300)
    .map((action: query.QueryServerAction) => action.payload)
    .switchMap(querypay => {
      if (querypay === '') {
        return empty();
      }

      const nextSearch$ = this.actions$.ofType(query.ActionTypes.QUERYSERVER).skip(1);

      if (querypay.search !== false) {
        this.searchService.getsearchresults(querypay)
          .takeUntil(nextSearch$)
          .subscribe((response) => {
            if (querypay.append) {
              this.store.dispatch(new search.SearchAction({response: response, append: true}));
              return empty();
            } else {
              this.store.dispatch(new search.SearchAction({response: response}));
              return empty();
            }
          });
        return empty();
      } else {
        return empty();
      }
    });

  constructor(
    private actions$: Actions,
    private searchService: SearchService,
    private store: Store<fromRoot.State>
  ) { }

}
