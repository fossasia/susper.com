import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpModule } from '@angular/http';

/**
 * import 'FormsModule' to avoid
 * "Can't bind to 'ngModel' since it isn't a known property of 'input'" error
 */
import { FormsModule } from '@angular/forms';

import { RouterTestingModule } from '@angular/router/testing';
import { ContactComponent } from './contact.component';
import { FooterNavbarComponent } from '../footer-navbar/footer-navbar.component';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { validateMessage, validatePhone, validateEmail, validateName } from '../utils';

describe('Component: Contact', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule, RouterTestingModule, FormsModule],
      declarations: [FooterNavbarComponent, ContactComponent, ModalComponent],
    }).compileComponents();
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
    const compiled = fixture.debugElement.nativeElement;

    const image: HTMLImageElement = compiled.querySelector('div.navbar-header img');
    expect(image).toBeTruthy();
    expect(image.alt).toBe('brand');
  });

  it('should have a FooterNavbar Component', () => {
    const footerNavbar = new FooterNavbarComponent();
    expect(footerNavbar).toBeTruthy();
  });

  it('should have a footer element', () => {
    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('footer')).toBeTruthy();
  });

  it('should have an element app-footer-navbar', () => {
    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('app-footer-navbar')).toBeTruthy();
  });

  it('validates messages correctly', () => {
    expect(validateMessage('abc')).toBe(false);
    expect(
      validateMessage(
        'fdasfdasfsdaffffffffffffffffffffffffffffffasdfsafasdfadfdasfdasfsdaffffffffffffffffffffffffffffffasdfsafasdfad'
      )
    ).toBe(true);
  });

  it('validates phone number correctly', () => {
    expect(validatePhone('1234567890')).toBe(true);
    expect(validatePhone('123450')).toBe(false);
  });

  it('validates name correctly', () => {
    expect(validateName('susper')).toBe(true);
    expect(validateName('')).toBe(false);
  });

  it('validates email correctly', () => {
    expect(validateEmail('susper@gmail.com')).toBe(true);
    expect(validateEmail('fdasfdasf')).toBe(false);
  });
});
