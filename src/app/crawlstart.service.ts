import { Injectable } from '@angular/core';
import {Http, Jsonp} from "@angular/http";
import {Store} from "@ngrx/store";
import * as fromRoot from './reducers';
import {Observable} from "rxjs";
@Injectable()
export class CrawlstartService {
  server = 'yacy.searchlab.eu';
  searchURL = 'http://' + this.server + '/solr/select?callback=?';
  constructor(private http: Http, private jsonp: Jsonp, private store: Store<fromRoot.State>) { }
  getcrawldefaults() {
    return this.http.get('http://yacygrid.com:8300/yacy/grid/crawler/defaultValues.json').map(res => {
      res.json();
    });
  }
  private handleError (error: any) {
    // In some advance version we can include a remote logging of errors
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // Right now we are logging to console itself
    return Observable.throw(errMsg);
  }
  startcrawljob(crawlvalues) {
    this.http.post('http://yacy.searchlab.eu/Crawler_p.html', crawlvalues)
      .subscribe(res => {

      });
    }


}
