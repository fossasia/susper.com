import { Component, OnInit } from '@angular/core';
import {CrawlstartService} from "../crawlstart.service";

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
    "xsstopw": "off",
    "collection": "user",
    "agentName": ""
  };
  constructor(private crawlstartservice: CrawlstartService) {
    /*this.crawlstartservice.getcrawldefaults().subscribe(res => {
      this.crawlvalues = res;
    });*/
  };
  starcrawljob() {
    this.crawlstartservice.startcrawljob(this.crawlvalues);
  };
  ngOnInit() {
  }

}
