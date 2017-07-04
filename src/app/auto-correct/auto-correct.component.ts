import {Component, OnInit, ChangeDetectorRef, Output, EventEmitter} from '@angular/core';
import {AutocorrectService} from "../autocorrect.service";
import {Router, ActivatedRoute} from "@angular/router";
import {Store} from "@ngrx/store";
import * as fromRoot from '../reducers';

@Component({
  selector: 'app-auto-correct',
  templateUrl: './auto-correct.component.html',
  styleUrls: ['./auto-correct.component.css']
})

export class AutoCorrectComponent implements OnInit {
  query$: any;
  suggestion: any;
  sugflag: boolean;
  resultsearch = '/search';
  @Output() hidecomponent: EventEmitter<any> = new EventEmitter<any>();
  constructor(private autocorrectservice: AutocorrectService, private route: Router, private activatedroute: ActivatedRoute,
              private store: Store<fromRoot.State>, private ref: ChangeDetectorRef) {
    this.sugflag = false;
    this.query$ = store.select(fromRoot.getquery);
    this.query$.subscribe(query => {
      if (query) {
            this.sugflag = false;
            this.autocorrectservice.getsearchresults(query).subscribe(res => {
                if (res) {
                    if (res['original'].toLocaleLowerCase() !== res['suggestion'].toLocaleLowerCase()) {
                        this.sugflag = true;
                        this.suggestion = res['suggestion'];
                      }
                    }
              });
          }
    });
  }
  ngOnInit() {
    }

  }
