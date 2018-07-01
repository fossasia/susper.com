import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { empty } from 'rxjs/observable/empty';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/takeUntil';
import * as query from '../actions/query';
export const NEWS_CHANGE: Action = {
  type: 'NEWS_CHANGE'
}
import * as fromRoot from '../reducers';
import * as news from '../actions/news';
import { NewsService } from "../services/news.service";
import { GetJsonService } from '../services/get-json.service';
export interface State {
  query: string;
}
@Injectable()
export class NewsEffects {

  @Effect()
  search$: Observable<any>
    = this.actions$
    .ofType(query.ActionTypes.QUERYSERVER)
    .debounceTime(300)
    .map((action: query.QueryServerAction) => action.payload)
    .switchMap(querypay => {
      if (querypay === '') {
        this.store.dispatch(new news.NewsSearchAction([]));
        return empty();
      }

      const nextSearch$ = this.actions$.ofType(query.ActionTypes.QUERYSERVER).skip(1);
      this.getJsonService.getJSON().subscribe(res => {
        for (let i = 0; i < res.newsOrgs.length; i++) {
        let newsResponse = [];
        this.newsService.getSearchResults(querypay, res.newsOrgs[i].provider)
        .takeUntil(nextSearch$)
        .subscribe((response) => {
            if (response.channels[0].items[0] !== undefined) {
                newsResponse.push(response.channels[0].items[0]);
            }
            if (response.channels[0].items[1] !== undefined) {
                newsResponse.push(response.channels[0].items[1]);

            }
            console.log(newsResponse);
        this.store.dispatch(new news.NewsSearchAction(newsResponse));
            return empty();
        });
        }
      }
    );

      return empty();
    });
  constructor(
    private actions$: Actions,
    private newsService: NewsService,
    private getJsonService: GetJsonService,
    private store: Store<fromRoot.State>
  ) { }


}
