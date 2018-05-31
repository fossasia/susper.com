import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Store} from '@ngrx/store';
import * as fromRoot from '../reducers';
import {KnowledgeapiService} from '../services/knowledgeapi.service';

@Component({
  selector: 'app-infobox',
  templateUrl: './infobox.component.html',
  styleUrls: ['./infobox.component.css']
})
export class InfoboxComponent implements OnInit {
  public title: string;
  public description: string;
  query$: any;
  resultsearch = '/search';
  constructor(private knowledgeservice: KnowledgeapiService,
              private route: Router,
              private activatedroute: ActivatedRoute,
              private store: Store<fromRoot.State>,
              private ref: ChangeDetectorRef) {
    this.query$ = store.select(fromRoot.getquery);
    this.query$.subscribe( query => {
      if (query) {
        this.knowledgeservice.getsearchresults(query).subscribe(res => {
          const pageId = Object.keys(res)[0];
          if (res[pageId].extract) {
            this.title = res[pageId].title;
            this.description = res[pageId].extract;
          } else {
            this.title = '';
            this.description = '';
          }
        });
      }
    });
  }

  ngOnInit() {
  }

}
