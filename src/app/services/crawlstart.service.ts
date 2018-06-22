import { Injectable } from '@angular/core';
import { Jsonp, RequestOptions, URLSearchParams } from "@angular/http";

import {Observable} from "rxjs";
import 'rxjs/add/operator/retry';
@Injectable()
export class CrawlstartService {

  constructor(
    private jsonp: Jsonp
  ) { }

  getcrawldefaults() {
    return this.jsonp.get('https://yacygrid.com:8300/yacy/grid/crawler/defaultValues.json?CALLBACK=JSONP_CALLBACK').map(res => {
      res.json();
    }).retry(2)
      .catch(this.handleError);

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
      .get('https://yacy.searchlab.eu/Crawler_p.json', options).map(res => {
        res.json();
      }).retry(2)
      .catch(this.handleError);
  }
}
