import { Injectable } from '@angular/core';
import {URLSearchParams, Http, Jsonp} from "@angular/http";
import {Store} from "@ngrx/store";
import * as fromRoot from './reducers';
import {Observable} from "rxjs";

@Injectable()
export class IntelligenceService {
  server = 'http://api.susi.ai';
  searchURL = 'http://' + this.server + '/susi/chat.json';
  constructor(private http: Http, private jsonp: Jsonp, private store: Store<fromRoot.State>) {
  }
  getintelligentresponse(searchquery) {
    let params = new URLSearchParams();
    params.set('q', searchquery);
    params.set('callback', 'JSONP_CALLBACK');
    return this.jsonp
      .get('http://api.asksusi.com/susi/chat.json', {search: params}).map(res =>
        res.json()

      );
  }

  private handleError(error: any) {
    // In some advance version we can include a remote logging of errors
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // Right now we are logging to console itself
    return Observable.throw(errMsg);
  }
}
