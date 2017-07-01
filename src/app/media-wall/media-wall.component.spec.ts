import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaWallComponent } from './media-wall.component';
import {MediaWallLinkerComponent} from "../wall-linker/wall-linker.component";

describe('MediaWallComponent', () => {
  let component: MediaWallComponent;
  let fixture: ComponentFixture<MediaWallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MediaWallComponent,
      MediaWallLinkerComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaWallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


});
