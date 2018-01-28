import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromRoot from '../reducers';
import { KnowledgeapiService } from '../services/knowledgeapi.service';
import { Observable } from "rxjs";
import { SpeechSynthesisService } from '../services/speech-synthesis.service';
import {ThemeService} from '../services/theme.service';
declare var window: any;
declare var SpeechSynthesisUtterance: any;

@Component({
  selector: 'app-infobox',
  templateUrl: './infobox.component.html',
  styleUrls: ['./infobox.component.css']
})
export class InfoboxComponent implements OnInit {
  results: Array<any>;
  query$: any;
  keyword: any;
  resultsearch = '/search';
  initialresults: Array<any>;
  resultscomponentchange$: Observable<any>;
  response$: Observable<any>;
  speechMode: any;

  constructor(
    private knowledgeservice: KnowledgeapiService,
    private route: Router,
    private activatedroute: ActivatedRoute,
    private store: Store<fromRoot.State>,
    private ref: ChangeDetectorRef,
    private synthesis: SpeechSynthesisService,
    private themeService: ThemeService
    ) {
    this.query$ = store.select(fromRoot.getwholequery);

    this.query$.subscribe(query => {
      this.keyword = query.query;
      this.speechMode = query.mode;
    });

    this.response$ = store.select(fromRoot.getKnowledge);

    this.response$.subscribe(res => {
      if (res.results) {
        if (res.results[0]) {
          if (res.results[0].label.toLowerCase().includes(this.keyword.toLowerCase())) {
            this.results = res.results;

            if (this.speechMode === 'speech') {
              this.startSpeaking(this.results[0].description);
            }
          } else {
              this.results = [];
          }
        }
      } else {
          this.results = [];
      }
    });

  }

  startSpeaking(description) {
    let msg = new SpeechSynthesisUtterance(description);

    window.speechSynthesis.cancel();
    window.speechSynthesis.resume();
    window.speechSynthesis.speak(msg);
  }

  ngOnInit() {
  }

}
