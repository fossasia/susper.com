import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AboutComponent } from './about.component';
import { FooterNavbarComponent } from '../footer-navbar/footer-navbar.component';
import { HttpModule } from '@angular/http';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

describe('Component: About', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule
      ],
      declarations: [
        AboutComponent,
        FooterNavbarComponent,
        ModalComponent
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an About Component', () => {
    const aboutComponent = new AboutComponent();
    expect(aboutComponent).toBeTruthy();
  });

  it('should have alt text property as brand', () => {
    const compiled = fixture.debugElement.nativeElement;

    const image: HTMLImageElement = compiled.querySelector('div.navbar-header img');
    expect(image).toBeTruthy();
    expect(image.alt).toBe('brand');
  });

  it('should have an footer navbar component', () => {
    const footerNavbar = new FooterNavbarComponent();
    expect(footerNavbar).toBeTruthy();
  });

  it('should have a footer element', () => {
    const compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('footer')).toBeTruthy();
  });

  it('should have an app-footer-navbar element', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('app-footer-navbar')).toBeTruthy();
  });

});
