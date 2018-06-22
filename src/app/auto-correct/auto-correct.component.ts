import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { AutocorrectService } from "../services/autocorrect.service";
import { Router, ActivatedRoute } from "@angular/router";
import { Store } from "@ngrx/store";
import * as fromRoot from '../reducers';
import { Observable } from "rxjs";
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-auto-correct',
  templateUrl: './auto-correct.component.html',
  styleUrls: ['./auto-correct.component.css']
})

export class AutoCorrectComponent implements OnInit {
  query$: any;
  wholequery$: any;
  suggestion: any;
  sugflag: boolean;
  resultsearch = '/search';
  isQues: boolean;
  resultscomponentchange$: Observable<any>;

  @Output() hidecomponent: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private autocorrectservice: AutocorrectService,
    private route: Router,
    private activatedroute: ActivatedRoute,
    private store: Store<fromRoot.State>,
    private ref: ChangeDetectorRef,
    public themeService: ThemeService
  ) {

    this.sugflag = false;

    this.query$ = store.select(fromRoot.getquery);
    this.resultscomponentchange$ = store.select(fromRoot.getItems);

    this.resultscomponentchange$.subscribe(resp => {
      this.query$.subscribe(query => {
        if (query && !query.includes('/date')) {
          this.sugflag = false;
          this.isQues = false;
          this.isQues = query.substr (query.length - 1) === '?';

          this.autocorrectservice.getsearchresults(query.replace (/[?!]/g , "")).subscribe(res => {
            this.sugflag = false;
            if (res) {
              if (res['original'].replace(/[.,?!]/g , "").toLocaleLowerCase() !== res['suggestion'].replace(/[.,?!]/g , "").toLocaleLowerCase() && res['suggestion'] !== '') {
                this.sugflag = true;
                this.suggestion = this.isQues === true ? res['suggestion'] + '?' : res['suggestion'];
              } else {
                this.sugflag = false;
              }
            }
          });
        }
      }).unsubscribe();
    });
  }

  ngOnInit() {
  }

}
