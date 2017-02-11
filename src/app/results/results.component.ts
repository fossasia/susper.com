import { Component, OnInit } from '@angular/core';
import {SearchService} from '../search.service';
import {Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  items = [];
  totalResults: number;
  resultDisplay: string;
  noOfPages: number;
  presentPage: number;
  maxPage: number;
  start: number;
  end: number;
  begin: number;
  message: string;
  query: any;
  navigation: any;
  searchdata: any = {
    query : '',
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
  getNumber(N) {
    return Array.apply(null, {length: N}).map(Number.call, Number);
  };
  changeurl(modifier) {
    console.log(modifier);
    this.querylook['query'] = this.querylook['query'] + '+' + decodeURIComponent(modifier);
    console.log(this.querylook);
    this.route.navigate(['/search'], {queryParams: this.querylook});
  }
  getPresentPage(N) {
    this.presentPage = N;
    this.searchdata.start = (this.presentPage)  * this.searchdata.rows;
    this.route.navigate(['/search'], {queryParams: this.searchdata});

  }
  filterByDate() {
    this.searchdata.sort = 'last_modified desc';
    this.route.navigate(['/search'], {queryParams: this.searchdata});
  }
  filterByContext() {
    delete this.searchdata.sort;
    this.route.navigate(['/search'], {queryParams: this.searchdata});
  }
  Display(S) {
    return (this.resultDisplay === S);
  }
  videoClick() {
    this.resultDisplay = 'videos';
    this.searchdata.rows = 10;
    this.searchdata.fq = 'url_file_ext_s:(avi+OR+mov+OR+flw+OR+gif)';
    this.route.navigate(['/search'], {queryParams: this.searchdata});
  }
  imageClick() {
    this.resultDisplay = 'images';
    this.searchdata.rows = 100;
    this.searchdata.fq = 'url_file_ext_s:(png+OR+jpeg+OR+jpg+OR+gif)';
    this.route.navigate(['/search'], {queryParams: this.searchdata});
  }
  docClick() {
    this.resultDisplay = 'all';
    delete this.searchdata.fq;
    this.searchdata.rows = 10;
    this.route.navigate(['/search'], {queryParams: this.searchdata});
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
  constructor(private searchservice: SearchService, private route: Router, private activatedroute: ActivatedRoute) {

    this.activatedroute.queryParams.subscribe(query => {
      this.presentPage = query['start'] / this.searchdata.rows;
      this.searchdata.query = query['query'];
      this.querylook = Object.assign({}, query);
      this.searchdata.sort = query['sort'];
      this.begin = Number(query['start']) + 1;
      searchservice.getsearchresults(query).subscribe(res => {
        this.items = res.json()[0].channels[0].items;
        this.totalResults = Number(res.json()[0].channels[0].totalResults);
        this.navigation = res.json()[0].channels[0].navigation;
        this.end = Math.min(this.totalResults, this.begin + this.searchdata.rows - 1);
        this.message = 'showing results ' + this.begin + ' to ' + this.end + ' of ' + this.totalResults;
        this.noOfPages = Math.ceil(this.totalResults / this.searchdata.rows);
        this.maxPage =  Math.min(this.searchdata.rows, this.noOfPages);
      });

    });
    this.message = 'loading...';
    this.presentPage = 0;
    this.start = (this.presentPage) * this.searchdata.rows;
    this.begin = this.start + 1;
    this.end =  Math.min(this.totalResults, this.begin + this.searchdata.rows - 1);
    this.resultDisplay = 'all';

  }

  ngOnInit() {
    this.presentPage = 0;

  }

}
