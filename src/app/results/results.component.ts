import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ThemeService } from '../services/theme.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as fromRoot from '../reducers';
import { Store } from '@ngrx/store';
import * as queryactions from '../actions/query';
import { GetJsonService } from '../services/get-json.service';
import { NewsService } from '../services/news.service';
declare var $: any;

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
  count: number = 1;
  boxMessage = 'Show';
  newsResponse: Array<any>;
  searchdata: any = {
    query: '',
    start: 0,
    rows: 10,
  };

  expandedkey: number;
  querylook = {};
  hidefooter = 1;
  hideAutoCorrect = 1;
  totalNumber: number;
  querychange$: Observable<any>;
  wholequery$: Observable<any>;
  searchresults$: Observable<any>;
  resultscomponentchange$: Observable<any>;
  totalResults: number;
  hideIntelligence: boolean;
  startindex: number;
  expand: boolean = false;
  items: Array<any>;
  expandedrow: number;

  getNumber(N) {
    let result = Array.apply(null, { length: N }).map(Number.call, Number);
    if (result.length > 10) {
      result = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    }
    return result;
  };

  getPresentPage(N) {
    this.presentPage = N;
    let urldata = Object.assign({}, this.searchdata);
    urldata.start = (this.presentPage - 1) * urldata.rows;
    this.store.dispatch(new queryactions.QueryServerAction(urldata));
  }

  filterByDate() {
    let urldata = Object.assign({}, this.searchdata);
    urldata.query += urldata.query.substr(urldata.query.length - 6, 6) !== " /date" ? " /date" : "";
    this.store.dispatch(new queryactions.QueryServerAction(urldata));
  }

  filterByContext() {
    let urldata = Object.assign({}, this.searchdata);
    urldata.query = urldata.query.replace("/date", "");
    this.store.dispatch(new queryactions.QueryServerAction(urldata));
  }

  Display(S) {
    return (this.resultDisplay === S);
  }

  expandImage(key) {
    if (key === this.expandedkey || this.expand === false) {
      this.expand = !this.expand;
    }

    this.expandedkey = key;
    let i = key;
    let previouselementleft = 0;

    while ( $('.image' + i) && $('.image' + i).offset().left > previouselementleft) {
      this.expandedrow = i;
      previouselementleft = $('.image' + i).offset().left;
      i = i + 1;
    }
  }

  videoClick() {
    let urldata = Object.assign({}, this.searchdata);
    this.getPresentPage(1);
    this.resultDisplay = 'videos';
    urldata.start = 0;
    urldata.rows = 100;
    urldata.nopagechange = false;
    urldata.append = false;
    urldata.fq = 'url_file_ext_s:(avi+OR+mov+OR+flw+OR+mp4)';
    urldata.resultDisplay = this.resultDisplay;
    this.store.dispatch(new queryactions.QueryServerAction(urldata));
  }

  imageClick() {
    let urldata = Object.assign({}, this.searchdata);
    this.getPresentPage(1);
    this.resultDisplay = 'images';
    urldata.rows = 10;
    urldata.fq = 'url_file_ext_s:(png+OR+jpeg+OR+jpg+OR+gif)';
    urldata.resultDisplay = this.resultDisplay;
    this.store.dispatch(new queryactions.QueryServerAction(urldata));
  }
  newsClick() {
    let urldata = Object.assign({}, this.searchdata);
    this.getPresentPage(1);
    this.resultDisplay = 'news';
    delete urldata.fq;
    urldata.rows = 10;
    urldata.resultDisplay = this.resultDisplay;
    this.store.dispatch(new queryactions.QueryServerAction(urldata));
    }

  docClick() {
    let urldata = Object.assign({}, this.searchdata);
    this.getPresentPage(1);
    this.resultDisplay = 'all';
    delete urldata.fq;
    urldata.rows = 10;
    urldata.nopagechange = false;
    urldata.append = false;
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

  constructor(
    private route: Router,
    private activatedroute: ActivatedRoute,
    private store: Store<fromRoot.State>,
    private ref: ChangeDetectorRef,
    public themeService: ThemeService,
    public getJsonService: GetJsonService,
    public getNewsService: NewsService
  ) {
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

      if (query['mode']) {
        urldata.mode = query['mode'];
      }

      if (query['query']) {
        urldata.query = query['query'].replace('+', ' ');
      }

      this.store.dispatch(new queryactions.QueryAction(query['query']));
      this.querylook = Object.assign({}, query);
      this.begin = Number(query['start']) + 1;
      this.start = (this.presentPage - 1) * urldata.rows;
      this.begin = this.start + 1;
      urldata.rows = Number(query['rows']) || 10;
      this.presentPage = Math.abs(query['start'] / urldata.rows) + 1;
      let querydata = Object.assign({}, urldata);
      this.store.dispatch(new queryactions.QueryServerAction(querydata));
        this.getJsonService.getJSON().subscribe(res => { this.newsResponse = [];
          for (let i = 0; i < res.newsOrgs.length; i++) {
          this.getNewsService.getSearchResults(querydata, res.newsOrgs[i].provider).subscribe(
            response => {
                if (response.channels[0].items[0] !== undefined) {
                this.newsResponse.push(response.channels[0].items[0]);
                }
                if (response.channels[0].items[1] !== undefined) {
                this.newsResponse.push(response.channels[0].items[1]);
                }
            }
          );
        }
        });


      if (this.presentPage === 1) {
        this.hideAutoCorrect = 0;
      } else {
        this.hideAutoCorrect = 1;
      }
    });

    this.items$ = store.select(fromRoot.getItems);

    this.items$.subscribe(items => {
      this.items = items;
    });

    this.responseTime$ = store.select(fromRoot.getResponseTime);

    this.responseTime$.subscribe(responsetime => {
      this.hidefooter = 0;
    });

    this.searchresults$ = store.select(fromRoot.getSearchResults);

    this.searchresults$.subscribe( searchresults => {
      if (searchresults && searchresults.channels && searchresults.channels[0]) {
        this.startindex = parseInt(searchresults.channels[0].startIndex, 10);
      }
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

  onScroll () {
    let urldata = Object.assign({}, this.searchdata);

    this.getPresentPage(1);
    this.resultDisplay = 'images';
    urldata.start = (this.startindex) + urldata.rows;
    urldata.fq = 'url_file_ext_s:(png+OR+jpeg+OR+jpg+OR+gif)';
    urldata.resultDisplay = this.resultDisplay;
    urldata.append = true;
    urldata.nopagechange = true;
    this.store.dispatch(new queryactions.QueryServerAction(urldata));
  };

  increasePage() {
    this.count += 1;
  }

  decreasePage() {
    this.count -= 1;
  }

  BoxToggle() {
    if (this.boxMessage === 'Show') {
      this.boxMessage = 'Hide';
    } else {
      this.boxMessage = 'Show';
    }
  }

  ngOnInit() {
  }
}
