import { Injectable } from '@angular/core';
import {Http, URLSearchParams, Jsonp, Response} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {Store} from '@ngrx/store';
import * as fromRoot from '../reducers';
import * as search from '../actions/search';
import {Observable} from 'rxjs';

@Injectable()
export class SearchService {
  server = 'yacy.searchlab.eu';
  searchURL = 'http://' + this.server + '/solr/select?callback=?';
  suggestUrl = 'http://' + this.server + '/suggest.json?callback=?';
  homepage = 'http://susper.com';
  logo = '../images/susper.svg';
  Items: any;
  headline: string;
  greeting: string;
  queryplaceholder: string;

  constructor(
    private http: Http,
    private jsonp: Jsonp,
    private store: Store<fromRoot.State>
  ) {}

  getsearchresults(searchquery) {
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
      .get('http://yacy.searchlab.eu/solr/select', {search: params}).map(res =>

        res.json()[0]

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
