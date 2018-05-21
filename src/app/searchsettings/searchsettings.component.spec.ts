import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input, Output } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { JsonpModule } from '@angular/http';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { reducer } from '../reducers/index';
import { FooterNavbarComponent } from '../footer-navbar/footer-navbar.component';
import { SearchsettingsComponent } from './searchsettings.component';
import {BrowserModule} from "@angular/platform-browser";
import {IntelligenceComponent} from "../intelligence/intelligence.component";

describe('SearchsettingsComponent', () => {
  let component: SearchsettingsComponent;
  let fixture: ComponentFixture<SearchsettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        BrowserModule,
        CommonModule,
        FormsModule,
        HttpClientModule,
        JsonpModule,
        StoreModule.forRoot(reducer),
        StoreDevtoolsModule.instrument(),
      ],
      declarations: [
        FooterNavbarComponent,
        IntelligenceComponent,
        SearchsettingsComponent
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchsettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  it('should have an app-advancedsearch element', () => {
    let compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('app-footer-navbar')).toBeTruthy();
  });

  it('should have a save button', () => {
    let compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('button.savbtn'));
  });

  it('should have a cancel button', () => {
    let compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('button.cancbtn'));
  });

  it('should have a navbar', () => {
    let compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('nav.navbar'));
  });

  it('should have alt text property as brand', () => {
    let compiled = fixture.debugElement.nativeElement;

    let image: HTMLImageElement = compiled.querySelector('a.navbar-brand img');
    expect(image).toBeTruthy();
    expect(image.alt).toBe('brand');
  });

});
