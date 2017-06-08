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
    verify: false,
    nav: 'filetype,protocol,hosts,authors,collections,namespace,topics,date',
    start: 0,
    indexof: 'off',
    meanCount: '5',
    resource: 'global',
    prefermaskfilter: '',
    maximumRecords: 10,
    timezoneOffset: 0,
  };
  querydata$: Observable<any>;
  constructor(private route: ActivatedRoute,
    private router: Router, private store: Store<fromRoot.State>) {
    this.query$ = store.select(fromRoot.getquery);
    this.query$.subscribe(query => {
      this.searchdata.query = query;

    });

  };
  hidebox(event: any) {
    if (event.which === 13) {
      this.displayStatus = 'hidebox';
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
    this.store.dispatch(new query.QueryAction(event.target.value));
    if (event.target.value.length > 0) {
      this.store.dispatch(new queryactions.QueryServerAction({'query': this.searchdata.query}));
      this.displayStatus = 'showbox';
      this.submit();
      this.hidebox(event);
    } else {

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

