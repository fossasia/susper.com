import { Component, OnInit } from '@angular/core';
import {SearchService} from '../search.service';
import {Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
items = [];
constructor(private searchservice: SearchService, private route: Router, private activatedroute: ActivatedRoute) {

    this.activatedroute.params.subscribe(query => {
      searchservice.getsearchresults(query).subscribe(res => {
        this.items = res.json()[0].channels[0].items;

      });

    });

  }

  ngOnInit() {

  }

}
