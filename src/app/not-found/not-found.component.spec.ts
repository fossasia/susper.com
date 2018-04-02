import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotFoundComponent } from './not-found.component';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';
import { HttpModule, JsonpModule } from '@angular/http';
import { StoreModule } from '@ngrx/store';
import { reducer } from '../reducers/index';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { FormsModule } from '@angular/forms';
import { AutoCompleteComponent } from '../auto-complete/auto-complete.component';
import { SpeechService } from '../services/speech.service';
import { AutocompleteService } from '../services/autocomplete.service';
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
        SearchBarComponent,
        AutoCompleteComponent
      ],
      providers: [
        SpeechService,
        AutocompleteService,
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

  it('should have an app-search-bar element', () => {
    let compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('app-search-bar')).toBeTruthy();
  });

});
