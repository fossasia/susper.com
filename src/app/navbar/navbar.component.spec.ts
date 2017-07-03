import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input, Output } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import { NavbarComponent } from './navbar.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { AutoCompleteComponent } from '../auto-complete/auto-complete.component';
import { AutocompleteService } from '../autocomplete.service';
import { SpeechService } from '../speech.service';
/**
 * import HttpModule to avoid error -
 * No provider for Http!
 */
import { HttpModule, JsonpModule } from '@angular/http';
/**
 * import StoreModule and reducer to avoid error -
 * No provider for Store!
 */
import { StoreModule } from '@ngrx/store';
import { reducer } from '../reducers/index';
/**
 * import 'FormsModule' to avoid
 * "Can't bind to 'ngModel' since it isn't a known property of 'input'" error
 */
import { FormsModule } from '@angular/forms';
import {AutocorrectComponent} from "../autocorrect/autocorrect.component";

describe('Component: Navbar', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FormsModule,
        HttpModule,
        JsonpModule,
        StoreModule.provideStore(reducer)
      ],
      declarations: [
        NavbarComponent,
        SearchBarComponent,
        AutoCompleteComponent,
        AutocorrectComponent,
        DropdownComponent
      ],
      providers: [
        AutocompleteService,
        SpeechService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /**
   * No need to add 'create NavbarComponent' test-suite as it will require
   * to pass parameters :
   * router : Router, route: ActivatedRoute
   */

  it('should have an app-search-bar element', () => {
    let compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('app-search-bar')).toBeTruthy();
  });

  it('should have alt text property as brand', () => {
    let compiled = fixture.debugElement.nativeElement;
    let image: HTMLImageElement = compiled.querySelector('div.navbar-header img');

    expect(image).toBeTruthy();
    expect(image.alt).toBe('brand');
  });

  it('should have an app-dropdown element', () => {
    let compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('app-dropdown')).toBeTruthy();
  });

});
