import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as fromRoot from '../reducers';
import {Store} from "@ngrx/store";
import * as queryactions from '../actions/query';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})

export class IndexComponent implements OnInit {
  searchdata: any = {
    query: '',
    start: 0,
    rows: 10,

  };
  constructor(private route: ActivatedRoute, private router: Router, private store: Store<fromRoot.State> ) {
    this.store.dispatch(new queryactions.QueryAction(''));
    this.store.dispatch(new queryactions.QueryServerAction(''));
  }

  ngOnInit() {
    this.searchdata.timezoneOffset = new Date().getTimezoneOffset();
  }

}
