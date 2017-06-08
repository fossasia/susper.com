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
    verify: false,
    nav: 'filetype,protocol,hosts,authors,collections,namespace,topics,date',
    start: 0,
    indexof: 'off',
    meanCount: '5',
    resource: 'global',
    prefermaskfilter: '',
    rows: 10,
    timezoneOffset: 0,
  };
  querylook = {};
  hidefooter = 1;
  querychange$: Observable<any>;
  resultscomponentchange$: Observable<any>;
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
    this.searchdata.start = (this.presentPage - 1) * this.searchdata.rows;
    this.route.navigate(['/search'], { queryParams: this.searchdata });
  }

  filterByDate() {
    this.searchdata.sort = 'last_modified desc';
    this.route.navigate(['/search'], { queryParams: this.searchdata });
  }

  filterByContext() {
    delete this.searchdata.sort;
    this.route.navigate(['/search'], { queryParams: this.searchdata });
  }

  Display(S) {

    return (this.resultDisplay === S);

  }

  videoClick() {
    this.getPresentPage(0);
    this.resultDisplay = 'videos';
    this.searchdata.rows = 10;
    this.searchdata.fq = 'url_file_ext_s:(avi+OR+mov+OR+flw+OR+mp4)';
    this.searchdata.resultDisplay = this.resultDisplay;
    this.route.navigate(['/search'], { queryParams: this.searchdata });
  }

  imageClick() {
    this.getPresentPage(0);
    this.resultDisplay = 'images';
    this.searchdata.rows = 100;
    this.searchdata.fq = 'url_file_ext_s:(png+OR+jpeg+OR+jpg+OR+gif)';
    this.searchdata.resultDisplay = this.resultDisplay;
    this.route.navigate(['/search'], { queryParams: this.searchdata });

  }

  docClick() {
    this.getPresentPage(0);
    this.resultDisplay = 'all';
    delete this.searchdata.fq;
    this.searchdata.rows = 10;
    this.searchdata.resultDisplay = this.resultDisplay;
    this.route.navigate(['/search'], { queryParams: this.searchdata });
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
      this.hidefooter = 1;

      if (query['fq']) {

        if (query['fq'].includes('png')) {
          this.resultDisplay = 'images';
          this.searchdata.fq = 'url_file_ext_s:(png+OR+jpeg+OR+jpg+OR+gif)';
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
        this.searchdata.resultDisplay = this.resultDisplay;

      }



      if (query['start']) {
        this.searchdata.start = query['start'];
      } else {
        this.searchdata.start = 0;
      }

      this.searchdata.query = query['query'];
      this.store.dispatch(new queryactions.QueryAction(query['query']));
      this.querylook = Object.assign({}, query);
      this.searchdata.sort = query['sort'];
      this.begin = Number(query['start']) + 1;
      this.message = '';
      this.start = (this.presentPage - 1) * this.searchdata.rows;
      this.begin = this.start + 1;

      this.store.dispatch(new queryactions.QueryServerAction(query));
      this.items$ = store.select(fromRoot.getItems);
      this.searchdata.rows = Number(query['rows']) || 10;
      this.presentPage = Math.abs(query['start'] / this.searchdata.rows) + 1;

    });
    this.totalResults$ = store.select(fromRoot.getTotalResults);
    this.totalResults$.subscribe(totalResults => {
      if (totalResults) {
        this.hidefooter = 0;

      }

      this.end = Math.min(totalResults, this.begin + this.searchdata.rows - 1);
      this.message = 'About ' + totalResults + ' results';
      this.noOfPages = Math.ceil(totalResults / this.searchdata.rows);
      this.maxPage = Math.min(this.searchdata.rows, this.noOfPages);
    });
    this.resultscomponentchange$ = store.select(fromRoot.getItems);
    this.resultscomponentchange$.subscribe(res => {
      this.route.navigate(['/search'], {queryParams: this.searchdata});
    });
    this.querychange$ = store.select(fromRoot.getquery);
    this.querychange$.subscribe(res => {
      this.searchdata.query = res;
    });
  };

  ngOnInit() {

  }
}
