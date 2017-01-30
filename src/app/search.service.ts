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
    params.append('facet.field', 'url_file_ext_s');
    params.append('facet.field', 'url_protocol_s');
    params.append('facet.field', 'author_sxt');
    params.append('facet.field', 'collection_sxt');
    return this.jsonp
      .get('http://yacy.searchlab.eu/solr/select', {search: params}).map(res => {
        console.log(res.json()[0].channels[0].items);
        return res;
      });

  }


}
