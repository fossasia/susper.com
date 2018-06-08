import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Store} from '@ngrx/store';
import * as fromRoot from '../reducers';
import { Observable } from 'rxjs/Observable';
@Component({
  selector: 'app-infobox',
  templateUrl: './infobox.component.html',
  styleUrls: ['./infobox.component.css']
})
export class InfoboxComponent implements OnInit {
  title: string;
  description: string;
  query$: any;
  resultsearch = '/search';
  response$: Observable<any>;
  constructor(private route: Router,
              private activatedroute: ActivatedRoute,
              private store: Store<fromRoot.State>,
              private ref: ChangeDetectorRef) {
    this.query$ = store.select(fromRoot.getquery);
    this.response$ = store.select(fromRoot.getKnowledge);
    this.response$.subscribe(res => {
      if (res.extract) {
      this.title = res.title;
      this.description = res.extract;
      } else {
        this.title = '';
        this.description = '';
      }
    });
  }

  ngOnInit() {
  }

}
