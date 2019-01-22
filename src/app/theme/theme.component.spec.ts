import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeComponent } from './theme.component';
import { ThemeService } from '../services/theme.service';
import { By } from '@angular/platform-browser';

describe('ThemeComponent', () => {
  let component: ThemeComponent;
  let fixture: ComponentFixture<ThemeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ThemeComponent
      ],
      providers: [
        ThemeService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should have modal-title', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h4.modal-title')).toBeTruthy();
  });

  it('should have button of class close', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('button.close')).toBeTruthy();
  });

  it('should have 6 buttons of class theme-link', () => {
    const element = fixture.debugElement.queryAll(By.css('button.theme-link'));
    expect(element.length).toBe(6);
  });

  it('should set default theme', async(() => {
    spyOn(component, 'setTheme').and.callThrough();

    const element = fixture.debugElement.queryAll(By.css('button.theme-link'))[0];
    const btn = element.nativeElement as HTMLElement;
    btn.click();

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const theme = JSON.parse(localStorage.getItem('theme')).value;
      expect(theme).toBe('defaultTheme');
    });
  }));

  it('should set dark theme', async(() => {
    spyOn(component, 'setTheme').and.callThrough();

    const element = fixture.debugElement.queryAll(By.css('button.theme-link'))[1];
    const btn = element.nativeElement as HTMLElement;
    btn.click();

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const theme = JSON.parse(localStorage.getItem('theme')).value;
      expect(theme).toBe('darkTheme');
    });
  }));

  it('should set basic theme', async(() => {
    spyOn(component, 'setTheme').and.callThrough();

    const element = fixture.debugElement.queryAll(By.css('button.theme-link'))[2];
    const btn = element.nativeElement as HTMLElement;
    btn.click();

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const theme = JSON.parse(localStorage.getItem('theme')).value;
      expect(theme).toBe('basicTheme');
    });
  }));

  it('should set contrast theme', async(() => {
    spyOn(component, 'setTheme').and.callThrough();

    const element = fixture.debugElement.queryAll(By.css('button.theme-link'))[3];
    const btn = element.nativeElement as HTMLElement;
    btn.click();

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const theme = JSON.parse(localStorage.getItem('theme')).value;
      expect(theme).toBe('contrastTheme');
    });
  }));

  it('should set terminal theme', async(() => {
    spyOn(component, 'setTheme').and.callThrough();

    const element = fixture.debugElement.queryAll(By.css('button.theme-link'))[4];
    const btn = element.nativeElement as HTMLElement;
    btn.click();

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const theme = JSON.parse(localStorage.getItem('theme')).value;
      expect(theme).toBe('terminalTheme');
    });
  }));

  it('should set night theme', async(() => {
    spyOn(component, 'setTheme').and.callThrough();

    const element = fixture.debugElement.queryAll(By.css('button.theme-link'))[5];
    const btn = element.nativeElement as HTMLElement;
    btn.click();

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const theme = JSON.parse(localStorage.getItem('theme')).value;
      expect(theme).toBe('nightTheme');
    });
  }));
});
