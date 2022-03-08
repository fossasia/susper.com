import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
/**
 * import 'FormsModule' to avoid
 * "Can't bind to 'ngModel' since it isn't a known property of 'input'" error
 */
import { FormsModule } from '@angular/forms';
import { FooterNavbarComponent } from '../footer-navbar/footer-navbar.component';
import { TermsComponent } from './terms.component';
import {InfoboxComponent} from "../infobox/infobox.component";

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
        TermsComponent,
        InfoboxComponent
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

  it('should have alt text property as brand', () => {
    let compiled = fixture.debugElement.nativeElement;

    let image: HTMLImageElement = compiled.querySelector('div.navbar-header img');
    expect(image).toBeTruthy();
    expect(image.alt).toBe('brand');
  });

  it('should have a div with id left', () => {
    let compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('div#left'));
  });

  it('should have a div with id right', () => {
    let compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('div#right'));
  });

  it('should have a sidebar menu', () => {
    let compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('ul.sidebar-list'));
  });

  it('should have an active list on sidebar menu', () => {
    let compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('ul.sidebar-list li.active'));
  });

  it('should create a FooterNavbar Component', () => {
    const footerNavbar = new FooterNavbarComponent();
    expect(footerNavbar).toBeTruthy();
  });

  it('should have an app-footer-navbar element', () => {
    let compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('app-footer-navbar')).toBeTruthy();
  });

  it('should scroll', async(() => {
    let compiled = fixture.debugElement.nativeElement;
    const element = compiled.querySelector('li.element4 a');

    element.click();
    fixture.whenStable().then(() => {
      expect(compiled.querySelector('li.element4.active')).toBeTruthy();
    });
  }));

});
