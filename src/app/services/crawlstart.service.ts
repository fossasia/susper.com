import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Jsonp, Headers, RequestOptions, URLSearchParams} from "@angular/http";
import {Store} from "@ngrx/store";
import * as fromRoot from '../reducers';
import {Observable} from "rxjs";
@Injectable()
export class CrawlstartService {
  server = 'yacy.searchlab.eu';
  searchURL = 'https://' + this.server + '/solr/select?callback=?';

  constructor(
    private http: HttpClient,
    private jsonp: Jsonp,
    private store: Store<fromRoot.State>
  ) { }

  getcrawldefaults() {
    return this.jsonp.get('https://yacygrid.com:8300/yacy/grid/crawler/defaultValues.json?CALLBACK=JSONP_CALLBACK');/*.map(res => {
      res.json();
    });*/
  }

  private handleError (error: any) {
    // In some advance version we can include a remote logging of errors
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // Right now we are logging to console itself
    return Observable.throw(errMsg);
  }

  startCrawlJob(crawlvalues) {
    let params = new URLSearchParams();

    for (let key in crawlvalues) {
      if (crawlvalues.hasOwnProperty(key)) {
        params.set(key, crawlvalues[key]);
      }
    }

    params.set('callback', 'JSONP_CALLBACK');

    let options = new RequestOptions({ search: params });
    return this.jsonp
      .get('https://yacy.searchlab.eu/Crawler_p.json', options);/*.map(res => {
        res.json();
      });*/
  }
}
