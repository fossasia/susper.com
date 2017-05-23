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
import * as fromRoot from '../reducers';
import * as search from '../actions/search';
import {SearchService} from '../search.service';
import * as suggest from '../actions/suggest';
import { SuggestService } from '../suggest.service';

export const CHANGE = 'CHANGE';

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
export class SuggestEffects {

    @Effect()
    suggest$: Observable<any>
    = this.action$
        .ofType(suggest.ActionTypes.SUGGEST)
        .debounceTime(200)
        .map((action: suggest.SuggestionResponse) => action.payload)
        .switchMap(query => {
            const nextSuggest$ = this.action$.ofType(suggest.ActionTypes.SUGGEST);

            return this.suggestService.getQuerySuggestion(query.queryString)
                                        .takeUntil(nextSuggest$)
                                        .map(response => {
                                            return new suggest.SuggestionSuccess(response);
                                        })
                                        .catch(() => of(new suggest.SuggestionFail('')));
        });

    constructor(
        private action$: Actions,
        private suggestService: SuggestService,
        private store: Store<fromRoot.State>
    ) { }
}
