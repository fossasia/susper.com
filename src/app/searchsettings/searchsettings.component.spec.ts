import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchsettingsComponent } from './searchsettings.component';

describe('SearchsettingsComponent', () => {
  let component: SearchsettingsComponent;
  let fixture: ComponentFixture<SearchsettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchsettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchsettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

});
