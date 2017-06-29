import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromRoot from '../reducers';
import { KnowledgeapiService } from '../knowledgeapi.service';
import { Observable } from "rxjs";

@Component({
  selector: 'app-infobox',
  templateUrl: './infobox.component.html',
  styleUrls: ['./infobox.component.css']
})

export class InfoboxComponent implements OnInit {
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
    this.response$ = store.select(fromRoot.getKnowledge);
    this.response$.subscribe(res => {
      if (res.results) {
        if (res.results[0]) {
          if (res.results[0].label.toLowerCase().includes(this.keyword.toLowerCase())) {
            this.results = res.results;
          } else {
              this.results = [];
            }
        }
      } else {
          this.results = [];
        }

    });


  }

  ngOnInit() {
  }

}
