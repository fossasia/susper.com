import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-searchsettings',
  templateUrl: './searchsettings.component.html',
  styleUrls: ['./searchsettings.component.css']
})
export class SearchsettingsComponent implements OnInit {
  resultCount = 10;
  instantresults: boolean;

  constructor(private router: Router) {
    if (localStorage.getItem('instantsearch')) {
      this.instantresults = JSON.parse(localStorage.getItem('instantsearch')).value || false;
    } else {
      this.instantresults = false;
    }
  }

  ngOnInit() {
  }
  onSave() {
    if (this.instantresults) {
      localStorage.setItem('instantsearch', JSON.stringify({value: true}));
    } else {
      localStorage.setItem('instantsearch', JSON.stringify({ value: false }));
      localStorage.setItem('resultscount', JSON.stringify({ value: this.resultCount }));
    }
    this.router.navigate(['/']);
  }
  onCancel() {
    this.router.navigate(['/']);
  }

}
