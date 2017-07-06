import { Component, OnInit } from '@angular/core';
import {SocialmediaService} from "../socialmedia.service";
import {Observable} from "rxjs";
import {Store} from "@ngrx/store";
import * as fromRoot from '../reducers';
@Component({
  selector: 'app-socialmedia',
  templateUrl: './socialmedia.component.html',
  styleUrls: ['./socialmedia.component.css']
})
export class SocialmediaComponent implements OnInit {
  query$: Observable<any>;
  keyword: any;
  response$: Observable<any>;
  results: any;
  constructor(private socialmediaservice: SocialmediaService, private store: Store<fromRoot.State>) {
    this.query$ = store.select(fromRoot.getquery);
    this.query$.subscribe(query => {
      this.keyword = query;
      this.socialmediaservice.fetchQuery(query).subscribe(res => {
        console.log(res);
        this.results = res.statuses;
      });
    });

  }

  ngOnInit() {
  }

}
