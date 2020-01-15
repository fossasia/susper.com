import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ThemeService } from '../services/theme.service';
import { SearchBarComponent } from 'app/search-bar/search-bar.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @ViewChild(SearchBarComponent) searchComponent: SearchBarComponent;
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public themeService: ThemeService
  ) {}

  ngOnInit() {
    this.searchdata.timezoneOffset = new Date().getTimezoneOffset();
  }

  clearSearch() {
    this.searchComponent.clearSearch();
  }
  submit() {
    this.router.navigate(['/search'], { queryParams: this.searchdata });
  }
}
