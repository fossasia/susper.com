import { Component, OnInit } from '@angular/core';
import { url } from '../../assets/url_configuration';
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  susperUrl = url[0];
  yacyUrl = url[3];
  constructor() { }
  ngOnInit() {
  }

}
