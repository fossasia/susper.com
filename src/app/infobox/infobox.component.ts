import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Store} from '@ngrx/store';
import * as fromRoot from '../reducers';
import {KnowledgeapiService} from '../knowledgeapi.service';
import {Observable} from "rxjs";

@Component({
  selector: 'app-infobox',
  templateUrl: './infobox.component.html',
  styleUrls: ['./infobox.component.css']
})
export class InfoboxComponent implements OnInit {
  results: Array<any>;
  query$: any;
  resultsearch = '/search';
  initialresults: Array<any>;
  resultscomponentchange$: Observable<any>;
  response$: Observable<any>;
  constructor(private knowledgeservice: KnowledgeapiService, private route: Router, private activatedroute: ActivatedRoute,
              private store: Store<fromRoot.State>, private ref: ChangeDetectorRef) {
    this.query$ = store.select(fromRoot.getquery);
    this.resultscomponentchange$ = store.select(fromRoot.getItems);
    this.resultscomponentchange$.subscribe(res => {
      this.results = this.initialresults;
    });
    this.response$ = store.select(fromRoot.getKnowledge);
    this.response$.subscribe(res => {
      this.initialresults = res.results || [];

    });


  }
  getQuery(q) {
    return {query: q.toString(),
      verify: false,
      nav: 'filetype,protocol,hosts,authors,collections,namespace,topics,date',
      start: 0,
      indexof: 'off',
      meanCount: '5',
      resource: 'global',
      prefermaskfilter: '',
      rows: 10,
      timezoneOffset: 0};
  }
  ngOnInit() {
  }

}
