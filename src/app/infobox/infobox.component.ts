import { Component, OnInit } from '@angular/core';
import {Store} from '@ngrx/store';
import * as fromRoot from '../reducers';
import { Observable } from 'rxjs/Observable';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-infobox',
  templateUrl: './infobox.component.html',
  styleUrls: ['./infobox.component.css']
})
export class InfoboxComponent implements OnInit {
  title: string = '';
  description: string = '';
  results: object;
  query$: any;
  image: string;
  resultsearch = '/search';
  speechMode: any;
  content_response$: Observable<any>;
  image_response$: Observable<any>;
  constructor(private store: Store<fromRoot.State>,
              public themeService: ThemeService) {
    this.query$ = store.select(fromRoot.getquery);
    this.content_response$ = store.select(fromRoot.getKnowledgeContent);
    this.content_response$.subscribe(res => {
    this.results = res;
      if (res.extract) {
        this.title = res.title;
        this.description = res.extract;
      }
    });
    this.image_response$ = store.select(fromRoot.getKnowledgeImage);
    this.image_response$.subscribe(res => {
      if (typeof res.RelatedTopics !== 'undefined') {
        this.image = res.RelatedTopics[0].Icon.URL;
      } else {
        this.image = '';
      }
    });
  }

  ngOnInit() {
  }

}
