import { Component, OnInit } from '@angular/core';
import { url } from '../../assets/url_configuration';
@Component({
  selector: 'app-footer-navbar',
  templateUrl: './footer-navbar.component.html',
  styleUrls: ['./footer-navbar.component.css']
})
export class FooterNavbarComponent implements OnInit {

  susperUrl = url.susper.site;
  fossasia_repo = url.github_repo.fossasia;
  constructor() { }

  ngOnInit() {
  }

}
