import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";
import * as fromRoot from '../reducers';
import * as queryactions from '../actions/query';

@Component({
  selector: 'app-searchsettings',
  templateUrl: './searchsettings.component.html',
  styleUrls: ['./searchsettings.component.css']
})
export class SearchsettingsComponent implements OnInit {
  resultCount = 10;
  instantresults: boolean;
  wholequery$: Observable<any>;
  searchdata: Array<any> = [];

  constructor(
    private router: Router,
    private store: Store<fromRoot.State>
  ) {
    if (localStorage.getItem('instantsearch')) {
      this.instantresults = JSON.parse(localStorage.getItem('instantsearch')).value || false;
    } else {
      this.instantresults = false;
      localStorage.setItem('instantsearch', JSON.stringify({value: true}));
    }

    if (localStorage.getItem('resultscount')) {
      this.resultCount = JSON.parse(localStorage.getItem('resultscount')).value || false;
    } else {
      this.resultCount = 10;
    }

    this.wholequery$ = store.select(fromRoot.getwholequery);

    this.wholequery$.subscribe(data => {
      this.searchdata = data;
    });
  }

  ngOnInit() {
  }

  onSave() {
    if (this.instantresults) {
      localStorage.setItem('instantsearch', JSON.stringify({value: true}));
      localStorage.setItem('resultscount', JSON.stringify({ value: 10 }));
      this.store.dispatch(new queryactions.QueryServerAction({'query': '', start: 0, rows: 10, search: false}));
    } else {
      localStorage.removeItem('instantsearch');
      localStorage.setItem('resultscount', JSON.stringify({ value: this.resultCount }));
      this.store.dispatch(new queryactions.QueryServerAction({'query': '', start: 0, rows: this.resultCount, search: false}));
    }

    this.router.navigate(['/']);
  }

  onCancel() {
    this.router.navigate(['/']);
  }

  defaultCount() {
    this.resultCount = 10;
  }
}
