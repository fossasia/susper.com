import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {URLSearchParams, Jsonp, Response, Headers, RequestOptions} from '@angular/http';
import {Store} from "@ngrx/store";
import * as fromRoot from '../reducers';


@Injectable()
export class AutocorrectService {
  server = 'https://montanaflynn-spellcheck.p.mashape.com';
  searchURL = this.server + '/check/';
  homepage = 'https://susper.com';
  logo = '../images/susper.svg';

  constructor(
    private http: HttpClient,
    private jsonp: Jsonp,
    private store: Store<fromRoot.State>
  ) { }

  getsearchresults(searchquery) {
    let params = new URLSearchParams();

    params.set('text', searchquery);

    let headers = new Headers();

    headers.set('Accept', 'application/json');
    headers.set('X-Mashape-Key', 'MNy1dDOsyMmshBCz70BwQ51vfeuzp19LReMjsnKtccAQkuB9WM');

    let options:any = new RequestOptions({ headers: headers, search: params });
    return this.http
      .get(this.searchURL, options);/*.map(res =>

        res.json()

      ).catch(this.handleError);*/
  }

  private handleError (error: any) {
    // In some advance version we can include a remote logging of errors
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // Right now we are logging to console itself
    return Observable.throw(errMsg);
  }

}
