import { Injectable } from '@angular/core';
import {Http, URLSearchParams, Jsonp, Response, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {Store} from '@ngrx/store';
import * as fromRoot from './reducers';
import * as search from './actions/search';
import * as suggest from './actions/suggest';
import {Observable} from 'rxjs';

@Injectable()
export class SuggestService {
  server = 'yacy.searchlab.eu';
  suggestURL = 'http://' + this.server + '/suggest.json?q=?';
  homepage = 'http://susper.com';
  logo = '../images/susper.svg';

  getQuerySuggestion(suggestQuery) {
    let params = new URLSearchParams();
    params.set('q', suggestQuery);

    return this.jsonp.get(this.suggestURL.toString(), {search: params})
              .map(sugg => {
                sugg.json();
              })
              .catch(this.handleError);
  }

  private handleError(error: any) {
    // in some advance version we can include a remote logging of errors
    let errMsg = (error.message) ? error.message :
                  error.status ? '${error.status} - ${error.statusTest}' : 'Server error';
    console.log(errMsg); // right now we are logging to console itself
    return Observable.throw(errMsg);
  }

  constructor(
    private http: Http,
    private jsonp: Jsonp,
    private store: Store<fromRoot.State>
  ) { }

}
