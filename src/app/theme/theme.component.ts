import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../services/theme.service';

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
    if (localStorage.getItem('theme')) {
      this.applyTheme(JSON.parse(localStorage.getItem('theme')).value);
    }
  }

  applyTheme(theme: string) {
    switch (theme) {
      case "darkTheme": {
        return this.darkTheme();
      }
      case "basicTheme": {
        return this.basicTheme();
      }
      case "contrastTheme": {
        return this.contrastTheme();
      }
      case "terminalTheme": {
        return this.terminalTheme();
      }
      case "defaultTheme": {
        return this.defaultTheme();
      }
      default: {
        return;
      }
    }
  }

  setTheme(theme: string) {
    localStorage.setItem('theme', JSON.stringify({value: theme}));
    this.applyTheme(theme);
  }

  darkTheme() {
    this.themeService.backgroundColor = '#FFFFFF';
    this.themeService.titleColor = '#050404';
    this.themeService.linkColor = '#7E716E';
    this.themeService.descriptionColor = '#494443';
  }

  defaultTheme() {
    this.themeService.backgroundColor = '#FFFFFF';
    this.themeService.titleColor = '#1a0dab';
    this.themeService.linkColor = '#006621';
    this.themeService.descriptionColor = '#545454';
  }

  basicTheme() {
    this.themeService.backgroundColor = '#FFFFFF';
    this.themeService.titleColor = '#1a0dab';
    this.themeService.linkColor = '#494443';
    this.themeService.descriptionColor = '#7E716E';
  }

  contrastTheme() {
    this.themeService.backgroundColor = '#FFFFFF';
    this.themeService.titleColor = '#1a0dab';
    this.themeService.linkColor = '#006621';
    this.themeService.descriptionColor = '#800000';
  }

  terminalTheme() {
    this.themeService.backgroundColor = '#000000';
    this.themeService.titleColor = '#00ff00';
    this.themeService.linkColor = '#FFFFFF  ';
    this.themeService.descriptionColor = '#F1C40F';
  }
}
