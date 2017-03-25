/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {By, BrowserModule} from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { IndexComponent } from './index.component';
import {RouterTestingModule} from '@angular/router/testing';
import {CommonModule} from '@angular/common';
import {JsonpModule, HttpModule} from '@angular/http';
import {StoreModule} from '@ngrx/store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {reducer} from '../reducers/index';
import {FormsModule} from '@angular/forms';
import {AppComponent} from '../app.component';
import {NavbarComponent} from '../navbar/navbar.component';
import {ResultsComponent} from '../results/results.component';
import {NotFoundComponent} from '../not-found/not-found.component';
import {AdvancedsearchComponent} from '../advancedsearch/advancedsearch.component';
import {SearchBarComponent} from '../search-bar/search-bar.component';

describe('IndexComponent', () => {
  let component: IndexComponent;
  let fixture: ComponentFixture<IndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule,
        BrowserModule,
        CommonModule,
        FormsModule,
        HttpModule,
        JsonpModule,
        StoreModule.provideStore(reducer),
        StoreDevtoolsModule.instrumentOnlyWithExtension(),
      ],
      declarations: [
        AppComponent,
        NavbarComponent,
        IndexComponent,
        ResultsComponent,
        NotFoundComponent,
        AdvancedsearchComponent,
        SearchBarComponent
      ]
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
    let image: HTMLImageElement = compiled.querySelector('h2.yacy img');
    expect(image).toBeTruthy();
    expect(image.alt).toBe('YaCy');
  });

  it('should have an element app-search-bar', () => {
    let compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('app-search-bar')).toBeTruthy();
  });

  it('should have set-susper-default option', () => {
    let compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('div #set-susper-default')).toBeTruthy();
  });
});
