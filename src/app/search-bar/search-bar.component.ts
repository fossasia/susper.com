import {
  Component, OnInit, Input, Output, AfterContentInit, ContentChild,
  AfterViewChecked, AfterViewInit, ViewChild, ViewChildren
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromRoot from '../reducers';
import { Observable } from 'rxjs';
import * as query from '../actions/query';
import * as queryactions from '../actions/query';
import { SpeechService } from '../speech.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit, AfterViewInit {
  @ViewChildren('input') vc;
  query$: Observable<any>;
  displayStatus: any;
  searchdata = {
    query: '',
    rows: 10,
    start: 0,
    fq: ''
  };
  wholequery$: Observable<any>;
  resultspage: any;
  navbarWidth: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromRoot.State>,
    private speech: SpeechService
  ) {
    this.wholequery$ = store.select(fromRoot.getwholequery);
    this.wholequery$.subscribe(data => {
      this.searchdata = data;
    });
    this.resultspage = this.router.url.toString().includes('/search');

    if (this.router.url.toString().includes('/search')) {
      this.navbarWidth = '536px';
    }

  };

  speechRecognition() {
    this.speech.record('en_US').subscribe(voice => this.onquery(voice));
  }

  hidesuggestions(data: number) {
    if (data === 1) {
      this.displayStatus = 'hidebox';
    } else {
      this.displayStatus = 'showbox';
    }
  }

  onEnter(event: any) {
    if (event.which === 13) {

      if (this.searchdata.fq !== '') {
        this.store.dispatch(new queryactions.QueryServerAction({'query': event.target.value, start: 0, rows: this.searchdata.rows, fq: this.searchdata.fq}));
      } else {
        this.store.dispatch(new queryactions.QueryServerAction({
          'query': event.target.value,
          start: 0,
          rows: this.searchdata.rows
        }));
      }
      this.displayStatus = 'hidebox';
      event.target.blur();
      event.preventDefault();
      this.submit();
    }
  }

  onquery(event: any) {
    this.store.dispatch(new query.QueryAction(event));
    let instantsearch = JSON.parse(localStorage.getItem('instantsearch'));

    if (instantsearch && instantsearch.value) {
      if (this.searchdata.fq !== '') {
        this.store.dispatch(new queryactions.QueryServerAction({'query': event, start: 0, rows: this.searchdata.rows, fq: this.searchdata.fq}));
      } else {
        this.store.dispatch(new queryactions.QueryServerAction({
          'query': event,
          start: 0,
          rows: this.searchdata.rows
        }));
      }
      this.displayStatus = 'showbox';
    }
  }

  ShowAuto() {
    return (this.displayStatus === 'showbox');
  }

  ngOnInit() {
    this.displayStatus = 'hidebox';
  }

  ngAfterViewInit() {
    this.vc.first.nativeElement.focus();
  }

  submit() {
    if (this.searchdata.query.toString().length !== 0) {
      if (!this.resultspage) {
        this.router.navigate(['/search'], {queryParams: this.searchdata});
      }
    }
  }
}
