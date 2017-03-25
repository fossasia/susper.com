/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ResultsComponent } from './results.component';

describe('ResultsComponent', () => {
  let component: ResultsComponent;
  let fixture: ComponentFixture<ResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  it('should have an app-navbar element', () => {
    let compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('app-navbar')).toBeTruthy();
  });

  it('should have an app-advancedsearch element', () => {
    let compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('app-advancedsearch')).toBeTruthy();
  });

  it('should display all the search results', () => {
    let compiled = fixture.debugElement.nativeElement;
    let textResult = compiled.querySelector('div.text-result');

    expect(textResult).toBeTruthy();
  });

  it('should display all the image results', () => {
    let compiled = fixture.debugElement.nativeElement;
    let imageResult = compiled.querySelector('div.image-result');

    expect(imageResult).toBeTruthy();
  });

  it('should display all the video results', () => {
    let compiled = fixture.debugElement.nativeElement;
    let videoResult = compiled.querySelector('div.video-result');

    expect(videoResult).toBeTruthy();
  });

  it('should have pagination property', () => {
    let compiled = fixture.debugElement.nativeElement;
    let pagination = compiled.querySelector('div.pagination-property');

    expect(pagination).toBeTruthy();
  });
});
