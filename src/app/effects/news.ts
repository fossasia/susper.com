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
export const NEWS_SEARCH = 'NEWS_SEARCH';
import * as fromRoot from '../reducers';
import * as newsSearch from '../actions/news';
import { NewsService } from '../services/news.service';
import { newsOrgs } from '../shared/news-orgs';

export interface State {
  query: string;
}

@Injectable()
export class NewsSearchEffects {

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
        const orgs= newsOrgs;
        
        orgs.forEach((org)=>
        
        {   console.log(org);
            this.newsService.getSearchResults(querypay.query,org)
          .subscribe((response) => 
          console.log(response)
        );
        })  
        return empty();
      } 
      
      else {
        return empty();
      }
    });

  constructor(
    private actions$: Actions,
    private newsService: NewsService,
    private store: Store<fromRoot.State>
  ) { }

}
