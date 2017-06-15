import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input, Output } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import { NavbarComponent } from './navbar.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { AutoCompleteComponent } from '../auto-complete/auto-complete.component';
import { AutocompleteService } from '../autocomplete.service';
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
        AutoCompleteComponent
      ],
      providers: [
        AutocompleteService
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

  it('should have a dropdown menu', () => {
    let compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('li.dropdown')).toBeTruthy();
  });

  it('should have alt text property as brand', () => {
    let compiled = fixture.debugElement.nativeElement;
    let image: HTMLImageElement = compiled.querySelector('div.navbar-header img');

    expect(image).toBeTruthy();
    expect(image.alt).toBe('brand');
  });

  it('should have correct link to fossasia blogs site', () => {
    let compiled = fixture.debugElement.nativeElement;
    let blogUrl: HTMLLinkElement = compiled.querySelector('div #header-download a');

    expect(blogUrl).toBeTruthy();
    expect(blogUrl.href).toBe('http://blog.fossasia.org/');
  });

  it('should have correct link to Susper repository on GitHub', () => {
    let compiled = fixture.debugElement.nativeElement;
    let repoUrl: HTMLLinkElement = compiled.querySelector('div #header-code a');

    expect(repoUrl).toBeTruthy();
    expect(repoUrl.href).toBe('http://github.com/fossasia/susper.com');
  });

  it('should have correct link to Susper bug-tracker/issues', () => {
    let compiled = fixture.debugElement.nativeElement;
    let issueUrl: HTMLLinkElement = compiled.querySelector('div #header-bugs a');

    expect(issueUrl).toBeTruthy();
    expect(issueUrl.href).toBe('http://github.com/fossasia/susper.com/issues');
  });

  it('should have an app-auto-complete element', () => {
    let compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('app-auto-complete')).toBeTruthy();
  });

});
