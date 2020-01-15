import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {

  errorNumber: any;
  errorMsg: any;

  constructor(
    public themeService: ThemeService
  ) { }

  ngOnInit() {
    this.errorNumber = '404';
    this.errorMsg = 'Page not found';
  }

}
