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
      case "nightTheme": {
        return this.nightTheme();
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
    (document.getElementsByClassName("infobox")[0] as HTMLElement).style.color = '#252f41';
    (document.getElementsByClassName("navbar-header")[0] as HTMLElement).style.background = '#f8f8f8';
    (document.getElementsByClassName("container-fluid")[0] as HTMLElement).style.background = '#f8f8f8';
    (document.getElementsByClassName("container-fluid")[1] as HTMLElement).style.background = '#f8f8f8';
    (document.getElementsByClassName("footer-bar")[0] as HTMLElement).style.background = '#f2f2f2';
    (document.getElementsByClassName("footer-bar")[0] as HTMLElement).style.borderTop = '#e4e4e4';
    (document.getElementsByClassName("input-group")[0] as HTMLElement).style.background = '#ffffff';
    (document.getElementById("nav-input") as HTMLElement).style.background = '#ffffff';
    (document.getElementById("nav-input") as HTMLElement).style.color = '#000000';
    (document.getElementById("speech-button") as HTMLElement).style.background = '#ffffff';
    $(document).ready(function() {
      (document.getElementById("nav-button") as HTMLElement).style.background = '#ffffff';
      (document.getElementsByClassName("mean")[0] as HTMLElement).style.color = "#363636";
      (document.getElementsByClassName("card")[2] as HTMLElement).style.color = "#363636";      
    });
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

  nightTheme() {
    this.themeService.backgroundColor = '#222222';
    this.themeService.titleColor = '#5a9e26';
    this.themeService.linkColor = '#42a2f4';
    this.themeService.descriptionColor = '#dddddd';
    (document.getElementsByClassName("infobox")[0] as HTMLElement).style.color = '#ffffff';
    (document.getElementsByClassName("navbar-header")[0] as HTMLElement).style.background = '#373737';
    (document.getElementsByClassName("container-fluid")[0] as HTMLElement).style.background = '#373737';
    (document.getElementsByClassName("container-fluid")[1] as HTMLElement).style.background = '#373737';
    (document.getElementsByClassName("footer-bar")[0] as HTMLElement).style.background = '#373737';
    (document.getElementsByClassName("footer-bar")[0] as HTMLElement).style.border = '#373737';
    (document.getElementsByClassName("input-group")[0] as HTMLElement).style.background = '#323232';
    (document.getElementById("nav-input") as HTMLElement).style.background = '#323232';
    (document.getElementById("nav-input") as HTMLElement).style.color = '#ffffff';
    (document.getElementById("speech-button") as HTMLElement).style.background = '#323232';
    $(document).ready(function() {
      (document.getElementById("nav-button") as HTMLElement).style.background = '#323232';
      (document.getElementsByClassName("mean")[0] as HTMLElement).style.color = "#dddddd";
      (document.getElementsByClassName("card")[2] as HTMLElement).style.color = "#dddddd";      
    });
  }
}
