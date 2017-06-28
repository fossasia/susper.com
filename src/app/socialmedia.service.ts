import { Injectable } from '@angular/core';
import {Http, Jsonp, URLSearchParams, Headers, RequestOptions} from "@angular/http";
import {Store} from "@ngrx/store";
import {Observable} from "rxjs";
import * as fromRoot from './reducers';
@Injectable()
export class SocialmediaService {
  server = 'http://lookup.dbpedia.org';
  searchURL = this.server + '/api/search/KeywordSearch?';
  homepage = 'http://susper.com';
  logo = '../images/susper.svg';
  constructor(private http: Http, private jsonp: Jsonp, private store: Store<fromRoot.State>) {
  }
  getsearchresults(searchquery) {

    let params = new URLSearchParams();
    params.set('QueryString', searchquery);

    let headers = new Headers({ 'Accept': 'application/json' });
    let options = new RequestOptions({ headers: headers, search: params });
    return this.http
      .get(this.searchURL, options).map(res =>

        res.json()

      ).catch(this.handleError);

  }
  private handleError (error: any) {
    // In some advance version we can include a remote logging of errors
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // Right now we are logging to console itself
    return Observable.throw(errMsg);
  }
}
