import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Store} from '@ngrx/store';
import * as fromRoot from '../reducers';
import {KnowledgeapiService} from '../knowledgeapi.service';
import {Observable} from "rxjs";

@Component({
  selector: 'app-related-search',
  templateUrl: './related-search.component.html',
  styleUrls: ['./related-search.component.css']
})
export class RelatedSearchComponent implements OnInit {

  results: Array<any>;
  query$: any;
  keyword: any;
  resultsearch = '/search';
  initialresults: Array<any>;
  resultscomponentchange$: Observable<any>;
  response$: Observable<any>;
  constructor(private knowledgeservice: KnowledgeapiService, private route: Router, private activatedroute: ActivatedRoute,
              private store: Store<fromRoot.State>, private ref: ChangeDetectorRef) {
    this.query$ = store.select(fromRoot.getquery);
    this.query$.subscribe(query => {
      this.keyword = query;
    });
    this.resultscomponentchange$ = store.select(fromRoot.getItems);
    this.resultscomponentchange$.subscribe(res => {
      this.results = this.initialresults;
    });


    this.response$ = store.select(fromRoot.getKnowledge);
    this.response$.subscribe(res => {
      this.initialresults = res.results || [];

    });
  }

  ngOnInit() {
  }

}

