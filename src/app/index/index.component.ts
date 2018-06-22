import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as fromRoot from '../reducers';
import {Store} from "@ngrx/store";
import {Observable} from "rxjs";
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})

export class IndexComponent implements OnInit {
  searchdata: any = {
    query: '',
    start: 0,
    rows: 10,
    mode: 'text',
  };

  hidespeech: Observable<boolean>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromRoot.State>,
    public themeService: ThemeService
  ) {
    this.hidespeech = store.select(fromRoot.getSpeechMode);
  }

  ngOnInit() {
    document.getElementById('nav-group').style.width = '584px';
    document.getElementById('nav-input').style.width = '528px';
  }
}
