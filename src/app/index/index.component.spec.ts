/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { IndexComponent } from './index.component';

describe('IndexComponent', () => {
  let component: IndexComponent;
  let fixture: ComponentFixture<IndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  it('should have logo with correct alt text property', () => {
    let compiled = fixture.debugElement.nativeElement;
    let image: HTMLImageElement = compiled.querySelector('div.yacy img');
    
    expect(image).toBeTruthy();
    expect(image.alt).toBe('YaCy');
  });

  it('should have an element app-search-bar', () => {
    let compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('app-search-bar')).toBeTruthy();
  });

});