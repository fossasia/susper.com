import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {AutocompleteService} from "../autocomplete.service";
import {Router, ActivatedRoute} from "@angular/router";
import {Store} from "@ngrx/store";
import * as fromRoot from '../reducers';

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
    this.results = [];
    this.query$.subscribe( query => {
      if (query) {
        this.autocompleteservice.getsearchresults(query).subscribe(res => {
          if (res[0]) {
            // console.log(res[1]);
            this.results = res[1];
            this.results.concat(res[0]);
            if ( this.results.length > 5) {
            this.results = this.results.splice (0, 5);
            }
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
