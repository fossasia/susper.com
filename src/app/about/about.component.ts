
import { Component, OnInit } from '@angular/core';
import { url } from '../../assets/url_configuration';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
})
export class AboutComponent implements OnInit {
  yacySite: string;

  constructor() {}

  ngOnInit() {
    this.yacySite = url.yacy.site;
  }
}
