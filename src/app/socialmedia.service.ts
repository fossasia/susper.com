import { Injectable } from '@angular/core';
import {Http, Jsonp, URLSearchParams, Headers, RequestOptions} from "@angular/http";
import {Store} from "@ngrx/store";
import {Observable} from "rxjs";
import * as fromRoot from './reducers';
@Injectable()
export class SocialmediaService {
  apiUrl: URL = new URL('http://api.loklak.org/api/search.json');
  maximum_records_fetch = 20;
  minified_results = true;
  source = 'all';
  fields = 'created_at,screen_name,mentions,hashtags';
  limit = 10;
  timezoneOffset: string = new Date().getTimezoneOffset().toString();

  constructor(
    private jsonp: Jsonp
  ) { }

  public fetchQuery(query: string, lastRecord = 0) {
    const searchParams = new URLSearchParams();
    searchParams.set('q', query);
    searchParams.set('callback', 'JSONP_CALLBACK');
    searchParams.set('minified', this.minified_results.toString());
    searchParams.set('source', this.source);
    searchParams.set('maximumRecords', this.maximum_records_fetch.toString());
    searchParams.set('timezoneOffset', this.timezoneOffset);
    searchParams.set('startRecord', (lastRecord + 1).toString());
    searchParams.set('fields', this.fields);
    searchParams.set('limit', this.limit.toString());
    return this.jsonp.get(this.apiUrl.toString(), { search: searchParams })
      .map(this.extractData)
      .catch(this.handleError);

  }

  private extractData(res) {
    try {
      return res.json();
    } catch (error) {
      console.error(error);
    }
  }

  private handleError(error: any) {
    // In some advance version we can include a remote logging of errors
    const errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // Right now we are logging to console itself
    return Observable.throw(errMsg);
  }
}
