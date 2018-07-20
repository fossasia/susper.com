import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import {Action, Store} from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { empty } from 'rxjs/observable/empty';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/takeUntil';
import * as query from '../actions/query';
export const CHANGE: Action = {
  type: 'CHANGE'
}
import * as fromRoot from '../reducers';
import * as knowledge from '../actions/knowledge';
import { KnowledgeapiService } from "../services/knowledgeapi.service";
export interface State {
  query: string;
}
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
        this.store.dispatch(new knowledge.SearchContentAction([]));
        return empty();
      }

      const nextSearch$ = this.actions$.ofType(query.ActionTypes.QUERYSERVER).skip(1);

      this.knowledgeservice.getSearchResults(this.toTitleCase(querypay.query))
        .takeUntil(nextSearch$)
        .subscribe((response) => {
          if (response.query) {
            if (response.query.pages) {
            const res = response.query.pages;
            const pageID = Object.keys(res)[0];
       if (res[pageID].extract) {
        this.store.dispatch(new knowledge.SearchContentAction(res[pageID]));
        return empty();
       } else {
                   this.store.dispatch(new knowledge.SearchContentAction([]));
                    return empty();
            }
        }
      }
    });
    if (querypay.query !== '') {
        this.knowledgeservice.getImage(querypay.query)
        .takeUntil(nextSearch$)
        .subscribe((response) => {
          if (response.RelatedTopics.length > 0) {
            this.store.dispatch(new knowledge.SearchImageAction(response));
            return empty();
             } else {
                         this.store.dispatch(new knowledge.SearchImageAction([]));
                          return empty();
                  }

});
    }
    this.knowledgeservice.getQueryDescription(querypay.query)
        .takeUntil(nextSearch$)
        .subscribe((response) => {
          if (response['search']) {
            this.store.dispatch(new knowledge.DescriptionAction(response));
            return empty();
             } else {
                         this.store.dispatch(new knowledge.DescriptionAction([]));
                          return empty();
                  }

});
      return empty();
    });

  toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}
  constructor(
    private actions$: Actions,
    private knowledgeservice: KnowledgeapiService,
    private store: Store<fromRoot.State>
  ) { }


}
