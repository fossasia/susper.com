import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialmediaComponent } from './socialmedia.component';
import {MediaWallComponent} from "../media-wall/media-wall.component";
import {SocialmediaService} from "../socialmedia.service";
import {MediaWallLinkerComponent} from "../wall-linker/wall-linker.component";

describe('SocialmediaComponent', () => {
  let component: SocialmediaComponent;
  let fixture: ComponentFixture<SocialmediaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SocialmediaComponent,
        MediaWallComponent,
        MediaWallLinkerComponent
      ],
      providers: [
        SocialmediaService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialmediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


});
