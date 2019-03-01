/* tslint:disable:no-unused-variable */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoCompleteComponent } from './auto-complete.component';
import { AutocompleteService } from '../services/autocomplete.service';
import { HttpModule, JsonpModule } from '@angular/http';
import { reducer } from '../reducers/index';
import { StoreModule } from '@ngrx/store';
import { RouterTestingModule } from "@angular/router/testing";

describe('AutoCompleteComponent', () => {
  let component: AutoCompleteComponent;
  let fixture: ComponentFixture<AutoCompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpModule,
        JsonpModule,
        StoreModule.provideStore(reducer)
      ],
      declarations: [
        AutoCompleteComponent,
      ],
      providers: [
        AutocompleteService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create autocomplete component', () => {
    expect(component).toBeTruthy();
  });

  it('should have query$ variable', () => {
    expect(component.query$).toBeTruthy();
  });

  it('should have resultsearch variable equal to "/search"', () => {
    expect(component.resultsearch).toEqual('/search');
  });
});
