import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Jsonp, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Store } from '@ngrx/store';
import * as fromRoot from '../reducers';
import { Observable } from 'rxjs';
import { url } from '../../assets/url_configuration';
@Injectable()
export class KnowledgeapiService {

  server = 'https://en.wikipedia.org';
  searchURL = this.server + '/w/api.php?';
  descriptionURL = 'https://www.wikidata.org/w/api.php?';
  homepage = 'http://' + url.susper.site;
  logo = '../images/susper.svg';
  imgUrl = 'https://api.duckduckgo.com/?';
  constructor(private http: Http,
              private jsonp: Jsonp,
              private store: Store<fromRoot.State>) {
  }

  getSearchResults(searchquery) {

    const params = new URLSearchParams();

    params.set('origin', '*');
    params.set('format', 'json');
    params.set('action', 'query');
    params.set('prop', 'extracts');
    params.set('exintro', '');
    params.set('explaintext', '');
    params.set('titles', searchquery);

    const headers = new Headers({ 'Accept': 'application/json' });
    const options = new RequestOptions({ headers: headers, search: params });
    return this.http
      .get(this.searchURL, options).map(res =>
          res.json()
      ).catch(this.handleError);
  }

  getImage(searchquery) {
    const params = new URLSearchParams();

    params.set('origin', '*');
    params.set('q', searchquery);
    params.set('format', 'json');
    params.set('pretty', '1');
    const headers = new Headers({ 'Accept': 'application/json' });
    const options = new RequestOptions({ headers: headers, search: params });

    return this.http.get(this.imgUrl, options).map(res =>
      res.json()
      ).catch(this.handleError);
    }
  getQueryDescription(searchquery) {
    const params = new URLSearchParams();

    params.set('origin', '*');
    params.set('action', 'wbsearchentities');
    params.set('search', searchquery);
    params.set('language', 'en');
    params.set('format', 'json');
    const headers = new Headers({ 'Accept': 'application/json' });
    const options = new RequestOptions({ headers: headers, search: params });

    return this.http.get(this.descriptionURL, options).map(res =>
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
