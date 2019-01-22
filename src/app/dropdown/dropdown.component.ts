import { Component, OnInit } from '@angular/core';
import { url } from '../../assets/url_configuration';
@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css']
})
export class DropdownComponent implements OnInit {

  susperUrl = url.susper.site;
  fossasiaBlogUrl = url.fossasia.blog;
  fossasiaUrl = url.fossasia.site;
  loklakUrl = url.loklak.site;
  susiUrl = url.susi.site;
  eventyayUrl = url.eventyay.site;
  pslabUrl = url.pslab.site;
  fossasiaLabsUrl = url.fossasia.labs;
  fossasia_repo = url.github_repo.fossasia;
  badgeyayUrl = url.badgeyay.site;
  meilixUrl = url.meilix.site;
  phimpmeUrl = url.phimpme.site;
  susimagicmirrorUrl = url.susimagicmirror.site;
  yaydocUrl = url.yaydoc.site;
  badgemagicURL = url.badgemagic.repo;

  constructor() { }
  ngOnInit() {
  }
}
