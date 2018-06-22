import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Jsonp, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Store } from '@ngrx/store';
import * as fromRoot from '../reducers';
import * as search from '../actions/search';
import { Observable } from 'rxjs';

@Injectable()
export class KnowledgeapiService {

  server = 'https://en.wikipedia.org';
  searchURL = this.server + '/w/api.php?';
  homepage = 'http://susper.com';
  logo = '../images/susper.svg';
  imgUrl = 'https://api.duckduckgo.com/?';
  constructor(private http: Http,
              private jsonp: Jsonp,
              private store: Store<fromRoot.State>) {
  }

  getSearchResults(searchquery) {

    let params = new URLSearchParams();

    params.set('origin', '*');
    params.set('format', 'json');
    params.set('action', 'query');
    params.set('prop', 'extracts');
    params.set('exintro', '');
    params.set('explaintext', '');
    params.set('titles', searchquery);

    let headers = new Headers({ 'Accept': 'application/json' });
    let options = new RequestOptions({ headers: headers, search: params });
    return this.http
      .get(this.searchURL, options).map(res =>
          res.json()
      ).catch(this.handleError);

  }

  getImage(searchquery) {
    let params = new URLSearchParams();

    params.set('origin', '*');
    params.set('q', searchquery);
    params.set('format', 'json');
    params.set('pretty', '1');
    let headers = new Headers({ 'Accept': 'application/json' });
    let options = new RequestOptions({ headers: headers, search: params });

    return this.http.get(this.imgUrl, options).map(res =>
      res.json()
      ).catch(this.handleError);
    }

  private handleError (error: any) {
    // In some advance version we can include a remote logging of errors
    const errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // Right now we are logging to console itself
    return Observable.throw(errMsg);
  }
}
