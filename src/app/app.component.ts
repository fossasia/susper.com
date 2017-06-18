import {Component, OnInit} from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import {Store} from "@ngrx/store";
import * as fromRoot from './reducers';
import {Observable} from "rxjs";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Susper';
  resultscomponentchange$: Observable<any>;
  searchdata = {
    query: '',
    rows: 10,
    start: 0,
  };
  wholequery$: Observable<any>;
  constructor(private router: Router, private store: Store<fromRoot.State>) {
    this.resultscomponentchange$ = store.select(fromRoot.getItems);
    this.resultscomponentchange$.subscribe(res => {
      if (this.searchdata.query.length > 0) {
        this.router.navigate(['/search'], {queryParams: this.searchdata});
      }

    });
    this.wholequery$ = store.select(fromRoot.getwholequery);
    this.wholequery$.subscribe(data => {
      this.searchdata = data;
    });
  }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }

}
