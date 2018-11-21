import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { Component, Input, Output } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import { FormsModule } from '@angular/forms';
import { FooterNavbarComponent } from '../footer-navbar/footer-navbar.component';
import { HelpComponent } from './help.component';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

describe('HelpComponent', () => {
  let component: HelpComponent;
  let fixture: ComponentFixture<HelpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FormsModule
      ],
      declarations: [
        FooterNavbarComponent,
        HelpComponent,
        ModalComponent,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create a Help Component', () => {
    const help = new HelpComponent();
    expect(help).toBeTruthy();
  });

  it('should create a FooterNavbar Component', () => {
    const footerNavbar = new FooterNavbarComponent();
    expect(footerNavbar).toBeTruthy();
  });

  it('should have an element app-footer-navbar', () => {
    let compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('app-footer-navbar')).toBeTruthy();
  });

});
