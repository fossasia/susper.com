import { Component, OnInit } from '@angular/core';
import { url } from '../../assets/url_configuration';
@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css']
})
export class DropdownComponent implements OnInit {

  susperUrl = url[0];
  fossasiaBlogUrl = url[5];
  fossasiaUrl = url[6];
  loklakUrl = url[7];
  susiUrl = url[8];
  eventyayUrl = url[9];
  pslabUrl = url[10];
  fossasiaLabsUrl = url[11];
  constructor() { }
  ngOnInit() {
  }

}
