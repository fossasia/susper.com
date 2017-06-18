import {
  Component, OnInit, Input, Output, AfterContentInit, ContentChild,
  AfterViewChecked, AfterViewInit, ViewChild, ViewChildren
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromRoot from '../reducers';
import { Observable } from 'rxjs';
import * as query from '../actions/query';
import * as queryactions from '../actions/query';
@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit, AfterViewInit {
  @ViewChildren('input') vc;
  query$: Observable<any>;
  displayStatus: any;
  searchdata = {
    query: '',
    rows: 10,
    start: 0
  };
  wholequery$: Observable<any>;
  constructor(private route: ActivatedRoute,
              private router: Router, private store: Store<fromRoot.State>) {
    this.wholequery$ = store.select(fromRoot.getwholequery);
    this.wholequery$.subscribe(data => {
      this.searchdata = data;
    });

  };
  hidebox(event: any) {
    if (event.which === 13) {
      this.displayStatus = 'hidebox';
      event.target.blur();
      this.submit();
    }
  }
  hidesuggestions(data: number) {
    if (data === 1) {
      this.displayStatus = 'hidebox';
    } else {
      this.displayStatus = 'showbox';
    }
  }
  onquery(event: any) {
    this.store.dispatch(new query.QueryAction(event));
    let instantsearch = JSON.parse(localStorage.getItem('instantsearch'));

    if (instantsearch && instantsearch.value) {
      this.store.dispatch(new queryactions.QueryServerAction({'query': event, start: this.searchdata.start, rows: this.searchdata.rows}));
      this.displayStatus = 'showbox';
      this.hidebox(event);
    } else {
      if (event.which === 13) {
        this.store.dispatch(new queryactions.QueryServerAction({'query': event, start: this.searchdata.start, rows: this.searchdata.rows}));
        this.displayStatus = 'showbox';
        this.hidebox(event);
      }
    }
  }

  ShowAuto() {
    return (this.displayStatus === 'showbox');
  }
  ngOnInit() {
    this.displayStatus = 'hidebox';
  }
  ngAfterViewInit() {
    this.vc.first.nativeElement.focus();
  }
  submit() {
    if (this.searchdata.query.toString().length !== 0) {
      if (!this.router.url.toString().includes('/search')) {
        this.router.navigate(['/search'], {queryParams: this.searchdata});
      }

    }
  }

}

