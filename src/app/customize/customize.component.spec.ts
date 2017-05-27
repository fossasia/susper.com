import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomizeComponent } from './customize.component';
import {ThemeService } from '../theme.service';

describe('CustomizeComponent', () => {
  let component: CustomizeComponent;
  let fixture: ComponentFixture<CustomizeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CustomizeComponent,
      ],
      providers: [
        ThemeService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
