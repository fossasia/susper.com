import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Store} from '@ngrx/store';
import * as fromRoot from '../reducers';
import {KnowledgeapiService} from '../knowledgeapi.service';

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
  constructor(private knowledgeservice: KnowledgeapiService, private route: Router, private activatedroute: ActivatedRoute,
              private store: Store<fromRoot.State>, private ref: ChangeDetectorRef) {
    this.query$ = store.select(fromRoot.getquery);
    this.query$.subscribe( query => {
      if (query) {
        this.knowledgeservice.getsearchresults(query).subscribe(res => {
          if (res.results) {
            res.results.splice(0, 1);
            this.results = res.results;
            this.keyword = query;
          }

        });
      }
    });
  }

  ngOnInit() {
  }

}

