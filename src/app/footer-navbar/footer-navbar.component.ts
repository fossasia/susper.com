import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-footer-navbar',
  templateUrl: './footer-navbar.component.html',
  styleUrls: ['./footer-navbar.component.css']
})
export class FooterNavbarComponent implements OnInit {

  constructor(
    public themeService: ThemeService
  ) { }

  ngOnInit() {
  }

}
