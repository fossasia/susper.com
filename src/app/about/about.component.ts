
import { Component, OnInit } from '@angular/core';
import { url } from '../../assets/url_configuration';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
})
export class AboutComponent implements OnInit {
<<<<<<< HEAD
  susperUrl = url.susper.site;
  yacyUrl = url.yacy.api_server;
  fossasia_repo = url.github_repo.fossasia;
  mountainLogo = url.logos.mountain;
  constructor() { }
=======
  yacySite: string;

  constructor() {}

>>>>>>> upstream/development
  ngOnInit() {
    this.yacySite = url.yacy.site;
  }
}
