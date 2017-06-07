import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import {Effect, Actions, toPayload} from '@ngrx/effects';
import {Action, Store} from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { empty } from 'rxjs/observable/empty';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/takeUntil';
import * as query from '../actions/query';
export const CHANGE = 'CHANGE';
import * as fromRoot from '../reducers';
import * as knowledge from '../actions/knowledge';
import {SearchService} from '../search.service';
import {KnowledgeapiService} from "../knowledgeapi.service";
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
export class KnowledgeEffects {

  @Effect()
  search$: Observable<any>
    = this.actions$
    .ofType(query.ActionTypes.QUERYSERVER)
    .debounceTime(300)
    .map((action: query.QueryServerAction) => action.payload)
    .switchMap(querypay => {
      if (querypay === '') {
        this.store.dispatch(new knowledge.SearchAction([]));
        return empty();
      }

      const nextSearch$ = this.actions$.ofType(query.ActionTypes.QUERYSERVER).skip(1);

      this.knowledgeservice.getsearchresults(querypay.query)
        .takeUntil(nextSearch$)
        .subscribe((response) => {
        if (response.results) {
          if (response.results[0]) {
            if (response.results[0].label.toLowerCase().includes(querypay.query.toLowerCase())) {
              this.store.dispatch(new knowledge.SearchAction(response));
              return empty();
            } else {
              this.store.dispatch(new knowledge.SearchAction([]));
              return empty();
            }
          } else {
            this.store.dispatch(new knowledge.SearchAction([]));
          }

        } else {
          this.store.dispatch(new knowledge.SearchAction([]));
        }


        });
      return empty();




    });
  constructor(
    private actions$: Actions,
    private knowledgeservice: KnowledgeapiService,
    private store: Store<fromRoot.State>
  ) { }


}
