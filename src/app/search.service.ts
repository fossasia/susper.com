import { Injectable } from '@angular/core';
import {Http, URLSearchParams, Jsonp, Response} from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
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
  constructor(private http: Http, private jsonp: Jsonp) {
  }
    getsearchresults(searchquery) {
     let params = new URLSearchParams();
     params.set('query', searchquery.query);
     params.set('rows', searchquery.rows);
     return this.jsonp
     .get('http://yacy.searchlab.eu/yacysearch.json?callback=JSONP_CALLBACK', {search: params}).map(res => {
       console.log(res.json()[0].channels[0].items);
       return res;
       });

     }


}
