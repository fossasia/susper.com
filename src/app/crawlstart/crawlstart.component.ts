import { Component, OnInit } from '@angular/core';
import {CrawlstartService} from "../crawlstart.service";
import {Router} from "@angular/router";
@Component({
  selector: 'app-crawlstart',
  templateUrl: './crawlstart.component.html',
  styleUrls: ['./crawlstart.component.css']
})
export class CrawlstartComponent implements OnInit {
  crawlvalues: any = {
    "crawlingMode": "url",
    "crawlingURL": "",
    "sitemapURL": "",
    "crawlingFile": "",
    "crawlingDepth": 3,
    "crawlingDepthExtension": "",
    "range": "domain",
    "mustmatch": ".*",
    "mustnotmatch": "",
    "ipMustmatch": ".*",
    "ipMustnotmatch": "",
    "indexmustmatch": ".*",
    "indexmustnotmatch": "",
    "deleteold": "off",
    "deleteIfOlderNumber": 0,
    "deleteIfOlderUnit": "day",
    "recrawl": "nodoubles",
    "reloadIfOlderNumber": 0,
    "reloadIfOlderUnit": "day",
    "crawlingDomMaxCheck": "off",
    "crawlingDomMaxPages": 1000,
    "crawlingQ": "off",
    "directDocByURL": "off",
    "storeHTCache": "off",
    "cachePolicy": "if fresh",
    "indexText": "on",
    "indexMedia": "off",
    "collection": "user",
    "agentName": ""
  };
  constructor(private crawlstartservice: CrawlstartService, private router: Router) {
    /*this.crawlstartservice.getcrawldefaults().subscribe(res => {
      this.crawlvalues = res;
    });*/
  };

  startCrawlJob() {
    this.crawlstartservice.startCrawlJob(this.crawlvalues).subscribe(res => {
      alert('Started Crawl Job');
      this.router.navigate(['/']);
    }, (err) => {
      if (err === 'Unauthorized') {
        alert("Authentication Error");
      }
    });
  };

  ngOnInit() {
  }

}
