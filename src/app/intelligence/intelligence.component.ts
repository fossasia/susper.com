import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {Store} from "@ngrx/store";
import * as fromRoot from '../reducers';
import {IntelligenceService} from "../services/intelligence.service";
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-intelligence',
  templateUrl: './intelligence.component.html',
  styleUrls: ['./intelligence.component.css']
})
export class IntelligenceComponent implements OnInit {
  wholequery$: Observable<any>;
  actions: Array<any> = [];
  answer: any;
  resultscomponentchange$: Observable<any>;

  constructor(
    private store: Store<fromRoot.State>,
    private intelligence: IntelligenceService,
    public themeService: ThemeService
  ) {
    this.resultscomponentchange$ = store.select(fromRoot.getItems);

    this.resultscomponentchange$.subscribe(resp => {
      this.wholequery$ = store.select(fromRoot.getwholequery);

      this.wholequery$.subscribe(data => {
        this.intelligence.getintelligentresponse(data.query).subscribe(res => {
          if (res && res.answers && res.answers[0] && res.answers[0].actions) {
            this.actions = res.answers[0].actions;

            for (let action of this.actions) {
              if (action.type === 'answer' && action.mood !== 'sabta') {
                this.answer = action.expression;
              } else {
                this.answer = '';
              }
            }
          } else {
            this.answer = '';
          }
        });
      }).unsubscribe();

    });
  }

  ngOnInit() {
  }

}
