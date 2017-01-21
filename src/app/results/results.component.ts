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
  noOfPages: number;
  presentPage: number;
  maxPage: number;
  startRecord: number;
  end: number;
  start: number;
  message: string;
  query: any;
  searchdata = {
    query : '',
    verify: false,
    nav: 'filetype,protocol,hosts,authors,collections,namespace,topics,date',
    startRecord: 0,
    indexof: 'off',
    meanCount: '5',
    resource: 'global',
    prefermaskfilter: '',
    maximumRecords: 10,
    timezoneOffset: 0,
  };
  getNumber(N) {
    return Array.apply(null, {length: N}).map(Number.call, Number);
  };
  getPresentPage(N) {
    this.presentPage = N;
    console.log(this.presentPage);
    this.searchdata.startRecord = (this.presentPage - 1)  * 10;
    this.route.navigate(['/search', this.searchdata]);

  }
  incPresentPage() {
    this.presentPage = Math.min(this.noOfPages, this.presentPage + 1);
  }
  decPresentPage() {
    this.presentPage = Math.max(1, this.presentPage - 1);
  }
  constructor(private searchservice: SearchService, private route: Router, private activatedroute: ActivatedRoute) {

    this.activatedroute.params.subscribe(query => {
      this.presentPage = Math.max(1, (query['startRecord'] / 10));
      this.searchdata.query = query['query'];
      this.start = Number(query['startRecord']) + 1;
      searchservice.getsearchresults(query).subscribe(res => {
        this.items = res.json()[0].channels[0].items;
        this.totalResults = Number(res.json()[0].channels[0].totalResults);

        this.end = Math.min(this.totalResults, this.start + 9);
        this.message = 'showing results ' + this.start + ' to ' + this.end + ' of ' + this.totalResults;
        this.noOfPages = Math.ceil(this.totalResults / 10);
        this.maxPage =  Math.min(10, this.noOfPages);
      });

    });
    this.message = 'loading...';
    this.presentPage = 1;
    this.startRecord = (this.presentPage - 1) * 10;

  }

  ngOnInit() {
    this.presentPage = 1;

  }

}
