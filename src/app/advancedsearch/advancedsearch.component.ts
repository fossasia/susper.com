import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import * as fromRoot from '../reducers';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-advancedsearch',
  templateUrl: './advancedsearch.component.html',
  styleUrls: ['./advancedsearch.component.css']
})
export class AdvancedsearchComponent implements OnInit {
  querylook = {};
  navigation$: Observable<any>;
  selectedelements: Array<any> = [];

  changeurl(modifier, element) {
    this.querylook['query'] = this.querylook['query'] + '+' + decodeURIComponent(modifier);
    this.selectedelements.push(element);
    this.route.navigate(['/search'], {queryParams: this.querylook});
    return false;
  }

  removeurl(modifier) {
    this.querylook['query'] = this.querylook['query'].replace('+' + decodeURIComponent(modifier), '');
    this.route.navigate(['/search'], {queryParams: this.querylook});
  }

  constructor(private route: Router, private activatedroute: ActivatedRoute, private store: Store<fromRoot.State>) {
    this.activatedroute.queryParams.subscribe(query => {
      this.querylook = Object.assign({}, query);
      this.navigation$ = store.select(fromRoot.getNavigation);
    });
  }

  ngOnInit() {

  }

}
