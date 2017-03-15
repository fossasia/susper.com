import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css']
})

export class AboutComponent implements OnInit { 
    constructor(private route: ActivatedRoute,
                private router: Router) { }
    
    ngOnInit() { }
}
