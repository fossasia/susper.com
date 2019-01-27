import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestOptions } from '@angular/http';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/retry';

@Injectable()
export class AutocorrectService {
  server = 'https://montanaflynn-spellcheck.p.mashape.com';
  searchURL = this.server + '/check/';

  constructor(
    private http: HttpClient
  ) { }

  getsearchresults(searchquery) {
    let params = new HttpParams();

    params.set('text', searchquery);

    let headers = new HttpHeaders();

    headers.set('Accept', 'application/json');
    headers.set('X-Mashape-Key', 'MNy1dDOsyMmshBCz70BwQ51vfeuzp19LReMjsnKtccAQkuB9WM');

    let options = new RequestOptions({ headers: headers, search: params });
    return this.http
      .get(this.searchURL, options).retry(2)
      .catch(this.handleError);
  }

  private handleError (error: any) {
    // In some advance version we can include a remote logging of errors
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // Right now we are logging to console itself
    return Observable.throw(errMsg);
  }

}
