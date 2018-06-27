import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Jsonp, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Store } from '@ngrx/store';
import * as fromRoot from '../reducers';
import * as search from '../actions/search';
import { Observable } from 'rxjs';

@Injectable()
export class NewsService {

  searchURL = 'https://yacy.searchlab.eu/solr/select?query=';

  constructor(private jsonp: Jsonp,
              private store: Store<fromRoot.State>) {
  }

  getSearchResults(searchquery,org) {
    this.searchURL+=searchquery+' site:'+org;
    let params = new URLSearchParams();

    for (let key in searchquery) {
      if (searchquery.hasOwnProperty(key)) {
        params.set(key, searchquery[key]);
      }
    }
    params.set('wt', 'yjson');
    params.set('callback', 'JSONP_CALLBACK');

    params.set('facet', 'true');
    params.set('facet.mincount', '1');
    params.append('facet.field', 'host_s');
    params.append('facet.field', 'url_protocol_s');
    params.append('facet.field', 'author_sxt');
    params.append('facet.field', 'collection_sxt');

    return this.jsonp
      .get(this.searchURL, {search: params}).map(res =>

        res.json()[0]

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
