import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { AutocompleteService } from "../services/autocomplete.service";
import { Router, ActivatedRoute } from "@angular/router";
import { Store } from "@ngrx/store";
import * as fromRoot from '../reducers';

@Component({
  selector: 'app-auto-complete',
  templateUrl: './auto-complete.component.html',
  styleUrls: ['./auto-complete.component.css']
})

export class AutoCompleteComponent implements OnInit {
  results: Array<any>;
  query$: any;
  id: string;
  resultsearch = '/search';

  @Output() hidecomponent: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private autocompleteservice: AutocompleteService,
    private route: Router,
    private activatedroute: ActivatedRoute,
    private store: Store<fromRoot.State>,
    private ref: ChangeDetectorRef
  ) {

    this.query$ = store.select(fromRoot.getquery);

    this.results = [];

    this.query$.subscribe( query => {
      if (query) {
        this.autocompleteservice.getsearchresults(query).subscribe(res => {
          if (res) {
            if (res[0]) {
              this.results = res[1];
              if (this.results.length === 0) {
                this.hidecomponent.emit(1);
              } else {
                this.hidecomponent.emit(0);
              }
              this.results.concat(res[0]);
              if ( this.results.length > 5) {
                this.results = this.results.splice (0, 5);
              }
            } else {
              this.results = [];
              this.hidecomponent.emit(1);
            }
          } else {
            this.results = [];
            this.hidecomponent.emit(1);
          }
        });
      }
    });
  }

  getID() {
    if (this.route.url.toString() === '/') {
      return 'index-sug-box';
    } else {
      return 'sug-box';
    }
  }

  ngOnInit() {
  }

}
