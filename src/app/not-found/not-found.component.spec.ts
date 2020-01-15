import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotFoundComponent } from './not-found.component';
import { CommonModule } from '@angular/common';
import { HttpModule, JsonpModule } from '@angular/http';
import { StoreModule } from '@ngrx/store';
import { reducer } from '../reducers/index';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../services/theme.service';

describe('NotFoundComponent', () => {
  let component: NotFoundComponent;
  let fixture: ComponentFixture<NotFoundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        CommonModule,
        FormsModule,
        HttpModule,
        JsonpModule,
        StoreModule.provideStore(reducer),
      ],
      declarations: [
        NotFoundComponent,
      ],
      providers: [
        ThemeService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  it('it should have logo with correct alt text property', () => {
    let compiled = fixture.debugElement.nativeElement;
    let image: HTMLInputElement = compiled.querySelector('div.not-found-banner img');
    expect(image).toBeTruthy();
    expect(image.alt).toBe('YaCy');
  });

});
