import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as fromRoot from '../reducers';
import {Store} from "@ngrx/store";
import * as queryactions from '../actions/query';
import {Observable} from "rxjs";

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
  hidespeech: Observable<boolean>;
  constructor(private route: ActivatedRoute, private router: Router, private store: Store<fromRoot.State> ) {
    this.store.dispatch(new queryactions.QueryAction(''));
    this.hidespeech = store.select(fromRoot.getSpeechMode);
    this.store.dispatch(new queryactions.QueryServerAction(this.searchdata));
  }

  ngOnInit() {
    document.getElementById('nav-group').style.width = '584px';
    document.getElementById('nav-input').style.width = '528px';
    document.getElementById('sug-box').style.width = '586px';
  }

}
