import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {URLSearchParams, Jsonp, Response, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {Store} from '@ngrx/store';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Rx';
import * as search from '../actions/search';
import * as fromRoot from '../reducers';

@Injectable()
export class AutocompleteService {
  server = 'yacy.searchlab.eu';
  suggestUrl = 'https://' + this.server + '/suggest.json?callback=?';
  homepage = 'https://susper.com';
  logo = '../images/susper.svg';

  constructor(
    private http: HttpClient,
    private jsonp: Jsonp,
    private store: Store<fromRoot.State>
  ) { }

  getsearchresults(searchquery) {

    let params = new URLSearchParams();
    params.set('q', searchquery);
    // params.set('QueryClass', 'MaxHits=5');

    params.set('wt', 'yjson');
    params.set('callback', 'JSONP_CALLBACK');

    params.set('facet', 'true');
    params.set('facet.mincount', '1');
    params.append('facet.field', 'host_s');
    params.append('facet.field', 'url_protocol_s');
    params.append('facet.field', 'author_sxt');
    params.append('facet.field', 'collection_sxt');

    let headers = new Headers({ 'Accept': 'application/json' });
    let options = new RequestOptions({ headers: headers, search: params });
    return this.jsonp
      .get('https://yacy.searchlab.eu/suggest.json', {search: params})[0];/*.map(res =>

        res.json()[0]

      ).catch(this.handleError);*/
  }

  private handleError(error: any) {
    // In some advance version we can include a remote logging of errors
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // Right now we are logging to console itself
    return Observable.throw(errMsg);
  }

}
