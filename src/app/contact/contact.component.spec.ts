import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input, Output } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

/**
 * import 'FormsModule' to avoid
 * "Can't bind to 'ngModel' since it isn't a known property of 'input'" error
 */
import { FormsModule } from '@angular/forms';

import { RouterTestingModule } from '@angular/router/testing';
import { ContactComponent } from '../contact/contact.component';
import { FooterNavbarComponent } from '../footer-navbar/footer-navbar.component';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

describe('Component: Contact', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        RouterTestingModule,
        FormsModule
      ],
      declarations: [
        FooterNavbarComponent,
        ContactComponent,
        ModalComponent
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create a Contact Component', () => {
    const contactComponent = new ContactComponent();
    expect(contactComponent).toBeTruthy();
  });

  it('should have alt text property as brand', () => {
    let compiled = fixture.debugElement.nativeElement;

    let image: HTMLImageElement = compiled.querySelector('div.navbar-header img');
    expect(image).toBeTruthy();
    expect(image.alt).toBe('brand');
  });

  it('should have a FooterNavbar Component', () => {
    const footerNavbar = new FooterNavbarComponent();
    expect(footerNavbar).toBeTruthy();
  });

  it('should have an element app-footer-navbar', () => {
    let compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('app-footer-navbar')).toBeTruthy();
  });

});
