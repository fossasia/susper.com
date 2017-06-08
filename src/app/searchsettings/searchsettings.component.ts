import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-searchsettings',
  templateUrl: './searchsettings.component.html',
  styleUrls: ['./searchsettings.component.css']
})
export class SearchsettingsComponent implements OnInit {
  noofresults = 10;
  constructor() { }

  ngOnInit() {
  }

}
