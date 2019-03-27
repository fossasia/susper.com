import { Injectable } from '@angular/core';
import {Http, URLSearchParams, Jsonp, Response, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/retry';
import {Store} from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromRoot from '../reducers';
import { url } from '../../assets/url_configuration';

@Injectable()
export class AutocompleteService {
  server = url.yacy.api_server;
  suggestUrl = 'https://' + this.server + '/suggest.json';
  homepage = 'https://' + url.susper.site;
  logo = '../images/susper.svg';

  constructor(
    private http: Http,
    private jsonp: Jsonp,
    private store: Store<fromRoot.State>
  ) { }

  getsearchresults(searchquery) {

    let params = new URLSearchParams();
    params.set('q', searchquery);

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
      .get(this.suggestUrl, {search: params}).map(res =>

        res.json()[0]

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
