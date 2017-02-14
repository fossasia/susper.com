import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {

  searchdata = {
    query: '',
    verify: false,
    nav: 'filetype,protocol,hosts,authors,collections,namespace,topics,date',
    start: 0,
    indexof: 'off',
    meanCount: '5',
    resource: 'global',
    prefermaskfilter: '',
    maximumRecords: 10,
    timezoneOffset: 0
  };
  constructor(private route: ActivatedRoute,
              private router: Router ) { }

  ngOnInit() {
    this.searchdata.timezoneOffset = new Date().getTimezoneOffset();
  }
  submit() {
    this.router.navigate(['/search'], {queryParams: this.searchdata});
  }

}

