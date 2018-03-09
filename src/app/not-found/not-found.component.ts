import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {
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

  errorNumber: any;
  errorMsg: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public themeService: ThemeService
  ) { }

  ngOnInit() {
    this.searchdata.timezoneOffset = new Date().getTimezoneOffset();
    this.errorNumber = '404';
    this.errorMsg = 'Page not found';
  }

  submit() {
    this.router.navigate(['/search', this.searchdata]);
  }

}
