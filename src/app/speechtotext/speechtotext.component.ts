import { Component, OnInit } from '@angular/core';
import {SpeechService} from "../speech.service";
import {Store} from "@ngrx/store";
import * as fromRoot from '../reducers';
import * as query from '../actions/query';
import * as queryactions from '../actions/query';
import * as speechactions from '../actions/speech';
import {Observable} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-speechtotext',
  templateUrl: './speechtotext.component.html',
  styleUrls: ['./speechtotext.component.css']
})
export class SpeechtotextComponent implements OnInit {
  message: any = "Speak Now";
  ticks: any = 0;
  timer: any;
  subscription: any;
  change: boolean = false;
  borderheight = 0;
  borderwidth = 0;
  buttoncolor = '#fff';
  miccolor = '#f44';
  resultspage: boolean;
  constructor(private speech: SpeechService, private store: Store<fromRoot.State>,
  private router: Router) {
    this.resultspage = this.router.url.toString().includes('/search');
    this.speechRecognition();
  }
  speechRecognition() {
    this.speech.record('en_US').subscribe(voice => this.onquery(voice));
  }
  onquery(event: any) {
    this.resettimer();
    this.store.dispatch(new queryactions.QueryServerAction({'query': event, start: 0, rows: 10, search: true}));
    this.message = event;
    let instantsearch = JSON.parse(localStorage.getItem('instantsearch'));

    if (instantsearch && instantsearch.value) {
      this.store.dispatch(new queryactions.QueryServerAction({
        'query': event,
        start: 0,
        rows: 10,
      }));

    }
  }
  hidespeech() {
    this.store.dispatch(new speechactions.SearchAction(false));
  }
  randomize(min, max) {
    let x;

    x = ( Math.random() * (max - min) + min);
    return x;
  }
  resettimer(recheck: boolean = false) {
    this.subscription.unsubscribe();
    this.message = "Listening...";
    this.timer = Observable.timer(0, 100);
    this.subscription = this.timer.subscribe(t => {
      this.ticks = t;
      if (t % 10 === 0 && t <= 20) {
        this.buttoncolor = "#f44";
        this.miccolor = "#fff";
        this.borderheight = this.randomize(0.7, 1);
        if (!recheck) {
          this.resettimer(true);
        }
      }
      if (t === 20) {
        this.borderheight = 0;
      }
      if (t === 30) {
        this.subscription.unsubscribe();
        this.store.dispatch(new speechactions.SearchAction(false));
      }
    });
  }

  ngOnInit() {
    this.timer = Observable.timer(5000, 1000);
    this.subscription = this.timer.subscribe(t => {
      this.ticks = t;

      if (t === 5) {
        this.subscription.unsubscribe();
        this.store.dispatch(new speechactions.SearchAction(false));
      }
    });
  }

}
