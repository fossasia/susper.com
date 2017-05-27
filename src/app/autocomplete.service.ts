import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Injectable } from '@angular/core';
import {Http, URLSearchParams, Jsonp, Response, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {Store} from '@ngrx/store';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Rx';
import * as search from './actions/search';
import * as fromRoot from './reducers';

@Injectable()
export class AutocompleteService {
  server = 'http://lookup.dbpedia.org';
  searchURL = this.server + '/api/search/PrefixSearch?';
  homepage = 'http://susper.com';
  logo = '../images/susper.svg';
  constructor(private http: Http, private jsonp: Jsonp, private store: Store<fromRoot.State>) {
  }
  getsearchresults(searchquery) {

    let params = new URLSearchParams();
    params.set('QueryString', searchquery);
   // params.set('QueryClass', 'MaxHits=5');

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
