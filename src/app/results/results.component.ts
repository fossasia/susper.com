import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SearchService } from '../search.service';
import { ThemeService } from '../theme.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as fromRoot from '../reducers';
import { Store } from '@ngrx/store';
import * as queryactions from '../actions/query';
@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  items$: Observable<any>;
  totalResults$: Observable<number>;
  responseTime$: Observable<any>;
  resultDisplay: string;
  noOfPages: number;
  presentPage: number;
  maxPage: number;
  start: number;
  end: number;
  begin: number;
  message: string;
  query: any;
  searchdata: any = {
    query: '',
    start: 0,
    rows: 10,

  };

  querylook = {};
  hidefooter = 1;
  hideAutoCorrect = 1;
  totalNumber: number;
  querychange$: Observable<any>;
  wholequery$: Observable<any>;
  resultscomponentchange$: Observable<any>;
  totalResults: number;
  hideIntelligence: boolean;

  getNumber(N) {
    let result = Array.apply(null, { length: N }).map(Number.call, Number);
    if (result.length > 10) {
      result = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    }
    return result;
  };
  advancedsearch() {
  }

  getPresentPage(N) {
    this.presentPage = N;
    let urldata = Object.assign({}, this.searchdata);
    urldata.start = (this.presentPage - 1) * urldata.rows;
    this.store.dispatch(new queryactions.QueryServerAction(urldata));

  }

  filterByDate() {
    let urldata = Object.assign({}, this.searchdata);
    urldata.sort = 'last_modified desc';
    this.store.dispatch(new queryactions.QueryServerAction(urldata));
  }

  filterByContext() {
    let urldata = Object.assign({}, this.searchdata);
    delete urldata.sort;
    this.store.dispatch(new queryactions.QueryServerAction(urldata));
  }

  Display(S) {

    return (this.resultDisplay === S);

  }

  videoClick() {
    let urldata = Object.assign({}, this.searchdata);
    this.getPresentPage(1);
    this.resultDisplay = 'videos';
    urldata.rows = 10;
    urldata.fq = 'url_file_ext_s:(avi+OR+mov+OR+flw+OR+mp4)';
    urldata.resultDisplay = this.resultDisplay;
    this.store.dispatch(new queryactions.QueryServerAction(urldata));
  }

  imageClick() {
    let urldata = Object.assign({}, this.searchdata);
    this.getPresentPage(1);
    this.resultDisplay = 'images';
    urldata.rows = 100;
    urldata.fq = 'url_file_ext_s:(png+OR+jpeg+OR+jpg+OR+gif)';
    urldata.resultDisplay = this.resultDisplay;
    this.store.dispatch(new queryactions.QueryServerAction(urldata));

  }

  docClick() {
    let urldata = Object.assign({}, this.searchdata);
    this.getPresentPage(1);
    this.resultDisplay = 'all';
    delete urldata.fq;
    urldata.rows = 10;
    urldata.resultDisplay = this.resultDisplay;
    this.store.dispatch(new queryactions.QueryServerAction(urldata));
  }

  incPresentPage() {
    this.presentPage = Math.min(this.noOfPages, this.presentPage + 1);
    this.getPresentPage(this.presentPage);
  }

  decPresentPage() {
    this.presentPage = Math.max(1, this.presentPage - 1);
    this.getPresentPage(this.presentPage);
  }

  getStyle(page) {
    return ((this.presentPage) === page);
  }

  constructor(private searchservice: SearchService, private route: Router, private activatedroute: ActivatedRoute,
    private store: Store<fromRoot.State>, private ref: ChangeDetectorRef, public themeService: ThemeService) {

    this.activatedroute.queryParams.subscribe(query => {
      let urldata = Object.assign({}, this.searchdata);
      if (query['fq']) {
        if (query['fq'].includes('png')) {
          this.resultDisplay = 'images';
          urldata.fq = 'url_file_ext_s:(png+OR+jpeg+OR+jpg+OR+gif)';
        } else if (query['fq'].includes('avi')) {
          this.resultDisplay = 'videos';
        } else {
          this.resultDisplay = 'all';
        }
      } else {
        this.resultDisplay = 'all';
      }
      if (query['resultDisplay']) {
        this.resultDisplay = query['resultDisplay'];
        urldata.resultDisplay = this.resultDisplay;
      }
      if (query['start']) {
        urldata.start = query['start'];
      } else {
        urldata.start = 0;
      }

      urldata.query = query['query'];
      this.store.dispatch(new queryactions.QueryAction(query['query']));
      this.querylook = Object.assign({}, query);
      this.begin = Number(query['start']) + 1;
      this.start = (this.presentPage - 1) * urldata.rows;
      this.begin = this.start + 1;
      urldata.rows = Number(query['rows']) || 10;
      this.presentPage = Math.abs(query['start'] / urldata.rows) + 1;
      let querydata = Object.assign({}, urldata);
      this.store.dispatch(new queryactions.QueryServerAction(querydata));
      if (this.presentPage === 1) {
        this.hideAutoCorrect = 0;
      } else {
        this.hideAutoCorrect = 1;
      }
    });


    this.items$ = store.select(fromRoot.getItems);
    this.responseTime$ = store.select(fromRoot.getResponseTime);
    this.responseTime$.subscribe(responsetime => {
      this.hidefooter = 0;
    });
    this.totalResults$ = store.select(fromRoot.getTotalResults);
    this.totalResults$.subscribe(totalResults => {
      this.totalResults = totalResults;
      this.end = Math.min(totalResults, this.begin + this.searchdata.rows - 1);
      this.totalNumber = totalResults;
      this.message = 'About ' + totalResults + ' results';
      this.noOfPages = Math.ceil(totalResults / this.searchdata.rows);
      this.maxPage = Math.min(this.searchdata.rows, this.noOfPages);
    });
    this.querychange$ = store.select(fromRoot.getquery);
    this.querychange$.subscribe(res => {
      this.hidefooter = 1;
    });
    this.wholequery$ = store.select(fromRoot.getwholequery);
    this.wholequery$.subscribe(data => {
      this.searchdata = data;
      if (this.searchdata.query === '') {
        this.hideIntelligence = true;
      } else {
        this.hideIntelligence = false;
      }
      this.start = (this.presentPage - 1) * data.rows;
      this.begin = this.start + 1;

    });

  }

  ngOnInit() {
    document.getElementById('nav-group').style.width = '632px';
  }
}
