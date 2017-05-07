import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Injectable } from '@angular/core';
import {Http, URLSearchParams, Jsonp, Response} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {Store} from '@ngrx/store';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Rx';
import * as search from './actions/search';
import * as fromRoot from './reducers';

@Injectable()
export class AutocompleteService implements OnInit {
  server = 'yacy.searchlab.eu';
  suggestUrl = 'http://' + this.server + '/suggest.json?callback=?';
  data: Observable<any>;
  search: any = {
    query: '',
    verify: false,
    nav: 'filetype,protocol,hosts,authors,collections,namespace,topics,date',
    start: 0,
    indexof: 'off',
    meanCount: '5',
    resource: 'global',
    prefermaskfilter: '',
    timezoneOffset: 0,
  };

  private searchTerms = new Subject<string>();

  onquery(term: string): void {
    this.searchTerms.next(term);
  }

  constructor(private searchService: AutocompleteService) { }

  ngOnInit(): void {
    this.data = this.searchTerms
      .debounceTime(300) // pause in events
      .distinctUntilChanged() // ignore if search term not changed
      .switchMap(term => term // switch to new observable each time
        // http service to retrieve data
        ? this.searchService.search(term)
        : Observable.of<any>([])
      );
  }
}
