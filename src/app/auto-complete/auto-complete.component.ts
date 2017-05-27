import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {AutocompleteService} from "../autocomplete.service";
import {Router, ActivatedRoute} from "@angular/router";
import {Store} from "@ngrx/store";
import * as fromRoot from '../reducers';
import {KnowledgeapiService} from "../knowledgeapi.service";

@Component({
  selector: 'app-auto-complete',
  templateUrl: './auto-complete.component.html',
  styleUrls: ['./auto-complete.component.css']
})
export class AutoCompleteComponent implements OnInit {

  results: Array<any>;
  query$: any;
  resultsearch = '/search';
  constructor(private autocompleteservice: AutocompleteService, private route: Router, private activatedroute: ActivatedRoute,
              private store: Store<fromRoot.State>, private ref: ChangeDetectorRef) {
    this.query$ = store.select(fromRoot.getquery);
    this.query$.subscribe( query => {
      if (query) {
        this.autocompleteservice.getsearchresults(query).subscribe(res => {
          if (res.results) {
            this.results = res.results;
          } else {
            this.results = [];
          }
        });
      }
    });
  }

  ngOnInit() {
  }

}
