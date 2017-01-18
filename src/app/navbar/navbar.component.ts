import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

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
    timezoneOffset: 0
  };
  constructor(private route: ActivatedRoute,
              private router: Router ) { }

  ngOnInit() {
    this.searchdata.timezoneOffset = new Date().getTimezoneOffset();
  }
  submit() {
    this.router.navigate(['/search', this.searchdata]);
  }

}
