/* tslint:disable:no-unused-variable */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpModule, JsonpModule } from '@angular/http';
import { IndexComponent } from './index.component';
import { StoreModule } from '@ngrx/store';
import { reducer } from '../reducers/index';
import { FormsModule } from '@angular/forms';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { AutoCompleteComponent } from '../auto-complete/auto-complete.component';
import { FooterNavbarComponent } from '../footer-navbar/footer-navbar.component';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { AutocompleteService } from '../services/autocomplete.service';
import { SpeechService } from '../services/speech.service';
import {SpeechtotextComponent} from "../speechtotext/speechtotext.component";
import { ThemeService } from '../services/theme.service';

describe('IndexComponent', () => {
  let component: IndexComponent;
  let fixture: ComponentFixture<IndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        RouterTestingModule,
        HttpModule,
        JsonpModule,
        StoreModule.provideStore(reducer)
      ],
      declarations: [
        IndexComponent,
        SearchBarComponent,
        FooterNavbarComponent,
        DropdownComponent,
        AutoCompleteComponent,
        SpeechtotextComponent
      ],
      providers: [
        AutocompleteService,
        SpeechService,
        ThemeService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  it('should have logo with correct alt text property', () => {
    let compiled = fixture.debugElement.nativeElement;
    let image: HTMLImageElement = compiled.querySelector('div img');
    expect(image).toBeTruthy();
    expect(image.alt).toBe('Susper');
  });

  it('should have an element app-search-bar', () => {
    let compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('app-search-bar')).toBeTruthy();
  });

  it('should have set-susper-default option', () => {
    let compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('div #set-susper-default')).toBeTruthy();
  });

});
