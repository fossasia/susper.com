import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../theme.service';

@Component({
  selector: 'app-theme',
  templateUrl: './theme.component.html',
  styleUrls: ['./theme.component.css']
})
export class ThemeComponent implements OnInit {

  constructor(
    private themeService: ThemeService
  ) { }

  ngOnInit() {
  }

  darkTheme() {
    this.themeService.titleColor = '#050404';
    this.themeService.linkColor = '#7E716E';
    this.themeService.descriptionColor = '#494443';
  }

  defaultTheme() {
    this.themeService.titleColor = '#1a0dab';
    this.themeService.linkColor = '#006621';
    this.themeService.descriptionColor = '#545454';
  }

}
