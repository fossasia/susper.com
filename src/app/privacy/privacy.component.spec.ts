import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input, Output } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

/**
 * import 'FormsModule' to avoid
 * "Can't bind to 'ngModel' since it isn't a known property of 'input'" error
 */

import { FormsModule } from '@angular/forms';
import { FooterNavbarComponent } from '../footer-navbar/footer-navbar.component';
import { PrivacyComponent } from './privacy.component';

describe('Component: Privacy', () => {
  let component: PrivacyComponent;
  let fixture: ComponentFixture<PrivacyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FormsModule
      ],
      declarations: [
        FooterNavbarComponent,
        PrivacyComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivacyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create a Privacy Component', () => {
    const privacy = new PrivacyComponent();
    expect(privacy).toBeTruthy();
  });

  it('should create a FooterNavbar Component', () => {
    const footerNavbar = new FooterNavbarComponent();
    expect(footerNavbar).toBeTruthy();
  });

});
