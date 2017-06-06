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

  constructor(private knowledgeservice: KnowledgeapiService, private route: Router, private activatedroute: ActivatedRoute,
              private store: Store<fromRoot.State>, private ref: ChangeDetectorRef) {
    this.query$ = store.select(fromRoot.getquery);
    this.resultscomponentchange$ = store.select(fromRoot.getItems);
    this.resultscomponentchange$.subscribe(res => {
      this.results = this.initialresults;
    });



    this.query$.subscribe( query => {
      if (query) {
        this.knowledgeservice.getsearchresults(query).subscribe(res => {
          if (res.results[0]) {
            if (res.results[0].label.toLowerCase().includes(query.toLowerCase())) {
              this.initialresults = res.results;
            } else {
              this.initialresults = [];
            }

          } else {
            this.initialresults = [];
          }

        });
      }else {
        this.initialresults = [];
      }
    });
  }

  ngOnInit() {
  }

}
