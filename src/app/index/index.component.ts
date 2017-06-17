import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  searchdata: any = {
    query: '',
    start: 0,
    rows: 10,

  };

  constructor(private route: ActivatedRoute,
              private router: Router ) { }

  ngOnInit() {
    this.searchdata.timezoneOffset = new Date().getTimezoneOffset();
  }

}
