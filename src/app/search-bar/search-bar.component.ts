import {
  Component, OnInit, Input, Output, AfterContentInit, ContentChild,
  AfterViewChecked, AfterViewInit, ViewChild, ViewChildren
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromRoot from '../reducers';
import { Observable } from 'rxjs';
import * as query from '../actions/query';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit, AfterViewInit {
  @ViewChildren('input') vc;
  query$: Observable<any>;
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
    timezoneOffset: 0
  };
  constructor(private route: ActivatedRoute,
    private router: Router, private store: Store<fromRoot.State>) {
    this.query$ = store.select(fromRoot.getquery);
    this.query$.subscribe(query => {
      this.searchdata.query = query;

    });

  };

  onquery(event: any) {

    this.store.dispatch(new query.QueryAction(event.target.value));
    this.submit();
  }

  ngOnInit() {
    this.searchdata.timezoneOffset = new Date().getTimezoneOffset();
  }
  ngAfterViewInit() {
    this.vc.first.nativeElement.focus();
  }
  submit() {
    this.router.navigate(['/search'], { queryParams: this.searchdata });
  }

}

