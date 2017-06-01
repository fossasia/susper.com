import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeComponent } from './theme.component';
import { ThemeService } from '../theme.service';

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
});
