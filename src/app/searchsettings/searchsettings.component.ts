import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-searchsettings',
  templateUrl: './searchsettings.component.html',
  styleUrls: ['./searchsettings.component.css']
})
export class SearchsettingsComponent implements OnInit {
  resultCount = 10;
  instantresults: boolean = JSON.parse(localStorage.getItem('instantsearch')).value;

  constructor(private router: Router) { }

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
