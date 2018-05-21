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
      case "nightTheme": {
        return this.nightTheme();
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
    this.themeService.cardColor = '#363636';
    this.themeService.navbarbgColor = '#f8f8f8';
    this.themeService.searchbarColor = '#000000';
    this.themeService.searchbarbgColor = '#ffffff';
    setFooter();
  }

  defaultTheme() {
    this.themeService.backgroundColor = '#FFFFFF';
    this.themeService.titleColor = '#1a0dab';
    this.themeService.linkColor = '#006621';
    this.themeService.descriptionColor = '#545454';
    this.themeService.cardColor = '#363636';
    this.themeService.navbarbgColor = '#f8f8f8';
    this.themeService.searchbarColor = '#000000';
    this.themeService.searchbarbgColor = '#ffffff';
    setFooter();
  }

  basicTheme() {
    this.themeService.backgroundColor = '#FFFFFF';
    this.themeService.titleColor = '#1a0dab';
    this.themeService.linkColor = '#494443';
    this.themeService.descriptionColor = '#7E716E';
    this.themeService.cardColor = '#363636';
    this.themeService.navbarbgColor = '#f8f8f8';
    this.themeService.searchbarColor = '#000000';
    this.themeService.searchbarbgColor = '#ffffff';
    setFooter();
  }

  contrastTheme() {
    this.themeService.backgroundColor = '#FFFFFF';
    this.themeService.titleColor = '#1a0dab';
    this.themeService.linkColor = '#006621';
    this.themeService.descriptionColor = '#800000';
    this.themeService.cardColor = '#363636';
    this.themeService.navbarbgColor = '#f8f8f8';
    this.themeService.searchbarColor = '#000000';
    this.themeService.searchbarbgColor = '#ffffff';
    setFooter();
  }

  terminalTheme() {
    this.themeService.backgroundColor = '#000000';
    this.themeService.titleColor = '#00ff00';
    this.themeService.linkColor = '#FFFFFF  ';
    this.themeService.descriptionColor = '#F1C40F';
    this.themeService.cardColor = '#363636';
    this.themeService.navbarbgColor = '#f8f8f8';
    this.themeService.searchbarColor = '#000000';
    this.themeService.searchbarbgColor = '#ffffff';
    setFooter();
  }

  nightTheme() {
    this.themeService.backgroundColor = '#222222';
    this.themeService.titleColor = '#5a9e26';
    this.themeService.linkColor = '#42a2f4';
    this.themeService.descriptionColor = '#dddddd';
    this.themeService.cardColor = '#dddddd';
    this.themeService.navbarbgColor = '#373737';
    this.themeService.searchbarColor = '#ffffff';
    this.themeService.searchbarbgColor = '#323232';
    (document.getElementsByClassName("footer-bar")[0] as HTMLElement).style.background = '#373737';
    (document.getElementsByClassName("footer-bar")[0] as HTMLElement).style.borderTop = '#222222';
  }
}

function setFooter() {
  (document.getElementsByClassName("footer-bar")[0] as HTMLElement).style.background = '#f2f2f2';
  (document.getElementsByClassName("footer-bar")[0] as HTMLElement).style.borderTop = '#e4e4e4';
}
