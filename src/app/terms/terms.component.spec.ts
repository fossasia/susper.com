import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input, Output } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

/**
 * import 'FormsModule' to avoid
 * "Can't bind to 'ngModel' since it isn't a known property of 'input'" error
 */
import { FormsModule } from '@angular/forms';
import { FooterNavbarComponent } from '../footer-navbar/footer-navbar.component';
import { TermsComponent } from './terms.component';

describe('Component: Terms', () => {
  let component: TermsComponent;
  let fixture: ComponentFixture<TermsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FormsModule
      ],
      declarations: [
        FooterNavbarComponent,
        TermsComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create a Terms Component', () => {
    const terms = new TermsComponent();
    expect(terms).toBeTruthy();
  });

  it('should create a FooterNavbar Component', () => {
    const footerNavbar = new FooterNavbarComponent();
    expect(footerNavbar).toBeTruthy();
  });

  it('should have alt text property as brand', () => {
    let compiled = fixture.debugElement.nativeElement;

    let image: HTMLImageElement = compiled.querySelector('div.navbar-header img');
    expect(image).toBeTruthy();
    expect(image.alt).toBe('brand');
  });

});
