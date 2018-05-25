import { Injectable } from '@angular/core';
import {URLSearchParams, Http, Jsonp} from "@angular/http";
import {Store} from "@ngrx/store";
import * as fromRoot from '../reducers';
import {Observable} from "rxjs";
import 'rxjs/add/operator/retry';

@Injectable()
export class IntelligenceService {

  private static readonly apiUrl: URL = new URL('https://api.susi.ai/susi/chat.json');
  private timezoneOffset = new Date().getTimezoneOffset().toString();

  constructor(
    private http: Http,
    private jsonp: Jsonp,
    private store: Store<fromRoot.State>
  ) {}

  getintelligentresponse(searchquery) {
    let params = new URLSearchParams();

    params.set('q', searchquery);
    params.set('callback', 'JSONP_CALLBACK');
    params.set('timezoneOffset', this.timezoneOffset);

    return this.jsonp
      .get('https://api.susi.ai/susi/chat.json', {search: params}).map(res =>
        res.json()
      ).retry(2)
      .catch(this.handleError);
  }

  private handleError(error: any) {
    // In some advance version we can include a remote logging of errors
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // Right now we are logging to console itself
    return Observable.throw(errMsg);
  }
}
