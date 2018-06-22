import {Component, OnInit} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Store } from "@ngrx/store";
import * as fromRoot from './reducers';
import { Observable } from "rxjs";
import * as queryactions from './actions/query';
import { SpeechService } from "./services/speech.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Susper';
  resultscomponentchange$: Observable<any>;

  searchdata = {
    query: '',
    rows: 10,
    start: 0,
    nopagechange: false
  };

  wholequery$: Observable<any>;
  hidespeech: Observable<any>;

  constructor(
    private router: Router,
    private store: Store<fromRoot.State>,
    private speech: SpeechService
  ) {
    this.hidespeech = store.select(fromRoot.getSpeechMode);

    this.hidespeech.subscribe(hidespeech => {
      if (!hidespeech) {
        this.speech.stoprecord();
      }
    });

    this.resultscomponentchange$ = store.select(fromRoot.getItems);

    this.resultscomponentchange$.subscribe(res => {
      if (this.searchdata.query.length > 0) {

        if (!this.searchdata.nopagechange) {
          this.router.navigate(['/search'], {queryParams: this.searchdata});
        }
      }
    });

    this.wholequery$ = store.select(fromRoot.getwholequery);

    this.wholequery$.subscribe(data => {
      this.searchdata = data;
    });

    if (localStorage.getItem('resultscount')) {
      this.store.dispatch(new queryactions.QueryServerAction({'query': '', start: 0, rows: 10, search: false, mode: 'text'}));
    }
  }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }

      window.scrollTo(0, 0);
    });
  }

}
