import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { FooterNavbarComponent } from '../footer-navbar/footer-navbar.component';
import { HelpComponent } from './help.component';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import 'bootstrap';

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

  it('should have 6 div of class accordion', () => {
    const element = fixture.debugElement.queryAll(By.css('div.accordion'));
    expect(element.length).toBe(6);
  });

  it('should have alt text property as brand', () => {
    const compiled = fixture.debugElement.nativeElement;

    const image: HTMLImageElement = compiled.querySelector('div.navbar-header img');
    expect(image).toBeTruthy();
    expect(image.alt).toBe('brand');
  });

  it('should have a div with class videos-slider', () => {
    const element = fixture.debugElement.queryAll(By.css('div.videos-slider'));
    expect(element).toBeTruthy();
  });

  it('should have preferences router', () => {
    const div = document.getElementById('accordion-3');
    const newAnchor = div.getElementsByTagName('a')[3];
    expect(newAnchor.getAttribute('href')).toEqual('/preferences');
  });

  it('should call open function on anchor click', async(() => {
    spyOn(component, 'open').and.callThrough();
    const element = fixture.debugElement.queryAll(By.css('div.accordion-section-content'))[0];
    const anchor = element.queryAll(By.css('a'))[0].nativeElement as HTMLElement;
    anchor.click();
    expect(component.open).toHaveBeenCalled();
  }));

  it('should call open function on anchor click', async(() => {
    spyOn(component, 'open').and.callThrough();
    const element = fixture.debugElement.queryAll(By.css('div.accordion-section-content'))[0];
    const anchor = element.queryAll(By.css('a'))[1].nativeElement as HTMLElement;
    anchor.click();
    expect(component.open).toHaveBeenCalled();
  }));

  it('should call open function on anchor click', async(() => {
    spyOn(component, 'open').and.callThrough();
    const element = fixture.debugElement.queryAll(By.css('div.accordion-section-content'))[0];
    const anchor = element.queryAll(By.css('a'))[2].nativeElement as HTMLElement;
    anchor.click();
    expect(component.open).toHaveBeenCalled();
  }));

  it('should call open function on anchor click', async(() => {
    spyOn(component, 'open').and.callThrough();
    const element = fixture.debugElement.queryAll(By.css('div.accordion-section-content'))[0];
    const anchor = element.queryAll(By.css('a'))[3].nativeElement as HTMLElement;
    anchor.click();
    expect(component.open).toHaveBeenCalled();
  }));

  it('should call open function on anchor click', async(() => {
    spyOn(component, 'open').and.callThrough();
    const element = fixture.debugElement.queryAll(By.css('div.accordion-section-content'))[1];
    const anchor = element.queryAll(By.css('a'))[0].nativeElement as HTMLElement;
    anchor.click();
    expect(component.open).toHaveBeenCalled();
  }));

  it('should call open function on anchor click', async(() => {
    spyOn(component, 'open').and.callThrough();
    const element = fixture.debugElement.queryAll(By.css('div.accordion-section-content'))[2];
    const anchor = element.queryAll(By.css('a'))[1].nativeElement as HTMLElement;
    anchor.click();
    expect(component.open).toHaveBeenCalled();
  }));

  it('should call open function on anchor click', async(() => {
    spyOn(component, 'open').and.callThrough();
    const element = fixture.debugElement.queryAll(By.css('div.accordion-section-content'))[3];
    const anchor = element.queryAll(By.css('a'))[1].nativeElement as HTMLElement;
    anchor.click();
    expect(component.open).toHaveBeenCalled();
  }));

  it('should call open function on anchor click', async(() => {
    spyOn(component, 'open').and.callThrough();
    const element = fixture.debugElement.queryAll(By.css('div.accordion-section-content'))[5];
    const anchor = element.queryAll(By.css('a'))[0].nativeElement as HTMLElement;
    anchor.click();
    expect(component.open).toHaveBeenCalled();
  }));

  it('should call open function on anchor click', async(() => {
    spyOn(component, 'open').and.callThrough();
    const element = fixture.debugElement.queryAll(By.css('div.accordion-section-content'))[5];
    const anchor = element.queryAll(By.css('a'))[1].nativeElement as HTMLElement;
    anchor.click();
    expect(component.open).toHaveBeenCalled();
  }));

  it('should call close function on close-btn click', async(() => {
    spyOn(component, 'close').and.callThrough();
    const closeBtn = fixture.debugElement.queryAll(By.css('a.close-btn'))[0].nativeElement;
    closeBtn.click();
    expect(component.close).toHaveBeenCalled();
  }));

  it('should call close function on close-btn click', async(() => {
    spyOn(component, 'close').and.callThrough();
    const closeBtn = fixture.debugElement.queryAll(By.css('a.close-btn'))[1].nativeElement;
    closeBtn.click();
    expect(component.close).toHaveBeenCalled();
  }));

  it('should call close function on close-btn click', async(() => {
    spyOn(component, 'close').and.callThrough();
    const closeBtn = fixture.debugElement.queryAll(By.css('a.close-btn'))[2].nativeElement;
    closeBtn.click();
    expect(component.close).toHaveBeenCalled();
  }));

  it('should call close function on close-btn click', async(() => {
    spyOn(component, 'close').and.callThrough();
    const closeBtn = fixture.debugElement.queryAll(By.css('a.close-btn'))[3].nativeElement;
    closeBtn.click();
    expect(component.close).toHaveBeenCalled();
  }));

  it('should call close function on close-btn click', async(() => {
    spyOn(component, 'close').and.callThrough();
    const closeBtn = fixture.debugElement.queryAll(By.css('a.close-btn'))[4].nativeElement;
    closeBtn.click();
    expect(component.close).toHaveBeenCalled();
  }));

  it('should call close function on close-btn click', async(() => {
    spyOn(component, 'close').and.callThrough();
    const closeBtn = fixture.debugElement.queryAll(By.css('a.close-btn'))[5].nativeElement;
    closeBtn.click();
    expect(component.close).toHaveBeenCalled();
  }));

  it('should call close function on close-btn click', async(() => {
    spyOn(component, 'close').and.callThrough();
    const closeBtn = fixture.debugElement.queryAll(By.css('a.close-btn'))[6].nativeElement;
    closeBtn.click();
    expect(component.close).toHaveBeenCalled();
  }));

  it('should call close function on close-btn click', async(() => {
    spyOn(component, 'close').and.callThrough();
    const closeBtn = fixture.debugElement.queryAll(By.css('a.close-btn'))[7].nativeElement;
    closeBtn.click();
    expect(component.close).toHaveBeenCalled();
  }));

  it('should call close function on close-btn click', async(() => {
    spyOn(component, 'close').and.callThrough();
    const closeBtn = fixture.debugElement.queryAll(By.css('a.close-btn'))[8].nativeElement;
    closeBtn.click();
    expect(component.close).toHaveBeenCalled();
  }));

});
