import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

/**
 * import 'FormsModule' to avoid
 * "Can't bind to 'ngModel' since it isn't a known property of 'input'" error
 */
import { FormsModule } from '@angular/forms';

import { FooterNavbarComponent } from './footer-navbar.component';

describe('Component: FooterNavbar', () => {
  let component: FooterNavbarComponent;
  let fixture: ComponentFixture<FooterNavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
      ],
      declarations: [
        FooterNavbarComponent,
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create FooterNavbar Component', () => {
    const footer = new FooterNavbarComponent();
    expect(footer).toBeTruthy();
  });
  it('should have an footer element', () => {
    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('footer')).toBeTruthy();
  });
});
