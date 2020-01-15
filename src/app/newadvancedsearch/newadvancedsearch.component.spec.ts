import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewadvancedsearchComponent } from './newadvancedsearch.component';
import {FooterNavbarComponent} from '../footer-navbar/footer-navbar.component';

describe('NewadvancedsearchComponent', () => {
  let component: NewadvancedsearchComponent;
  let fixture: ComponentFixture<NewadvancedsearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewadvancedsearchComponent,
        FooterNavbarComponent,

      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewadvancedsearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have alt text property as brand', () => {
    const compiled = fixture.debugElement.nativeElement;

    const image: HTMLInputElement = compiled.querySelector('div.navbar-header  img');
    expect(image).toBeTruthy();
    expect(image.alt).toBe('brand');
  });

  it('should have advanced-search-heading as Advanced Search', () => {
    const compiled = fixture.debugElement.nativeElement;

    const heading: HTMLInputElement = compiled.querySelector('h3.advanced-search-heading');
    expect(heading.innerHTML).toContain('Advanced Search');
  });

  it('should have an app-footer-navbar element', () => {
    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('app-footer-navbar')).toBeTruthy();
  });
});
