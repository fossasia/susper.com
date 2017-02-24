/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SearchBarComponent } from './search-bar.component';

describe('SearchBarComponent', () => {
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  it('should have an input element for search inputs', () => {
    let compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('div.input-group input#nav-input'));
  });

  it('should focus the input search element on initialization', () => {
    let compiled = fixture.debugElement.nativeElement;
    let inputElement: HTMLInputElement = compiled.querySelector('div.input-group input#nav-input');
    
    expect(document.activeElement).toBe(inputElement);
  });

   it('should have "searchdata" property', () => {
     let compiled = fixture.debugElement.nativeElement;

     expect(component.searchdata).toBeTruthy();
   });

  it('should dispatch "QueryAction" when value of searchdata changes', () => {
    let compiled = fixture.debugElement.nativeElement;

    let value = 'a';
    let query$ = component.store.select(fromRoot.getSearchQuery);
    let qs: string;
    let subscription = query$.subscribe(query => qs = query.queryString);

    expect(qs).toBeFalsy();
    component.searchdata.setValue(value);
    expect(qs).toBe(value);

    subscription.unsubscribe();
  });

  it('should have searchdata having the control of input field', () => {
    let compiled = fixture.debugElement.nativeElement;
    let inputElement: HTMLInputElement = compiled.querySelector('div.input-group input#nav-input');
    
    expect(component.searchData.value).toBeFalsy();
    expect(inputElement.value).toBeFalsy();

    component.searchData.setValue('a');
    fixture.detectChanges();
    inputElement = compiled.querySelector('div.input-group input#nav-group');
    expect(inputElement.value).toBe('a');

    compiled.querySelector('div.input-group input#nav-group');
    fixture.detectChanges();
    expect(component.searchdata.value).toBe('a');
  });

});