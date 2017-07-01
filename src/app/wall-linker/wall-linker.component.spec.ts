import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaWallLinkerComponent } from './wall-linker.component';

describe('WallLinkerComponent', () => {
  let component: MediaWallLinkerComponent;
  let fixture: ComponentFixture<MediaWallLinkerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MediaWallLinkerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaWallLinkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


});
