/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchBarComponent } from './search-bar.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { StoreModule } from '@ngrx/store';
import { reducer } from '../reducers/index';
import { AutocompleteService } from "../autocomplete.service";
import { AutoCompleteComponent } from "../auto-complete/auto-complete.component";
import { SpeechService } from '../speech.service';
import { DropdownComponent } from '../dropdown/dropdown.component';
import {SocialmediaComponent} from "../socialmedia/socialmedia.component";
import {MediaWallComponent} from "../media-wall/media-wall.component";
import {MediaWallLinkerComponent} from "../wall-linker/wall-linker.component";
import {IntelligenceComponent} from "../intelligence/intelligence.component";

describe('Component: SearchBarComponent', () => {
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({

      imports: [
        RouterTestingModule,
        FormsModule,
        HttpModule,
        JsonpModule,
        StoreModule.provideStore(reducer),
      ],
      declarations: [
        SearchBarComponent,
        AutoCompleteComponent,
        ThemeComponent,
        DropdownComponent,
        SocialmediaComponent,
        MediaWallComponent,
        MediaWallLinkerComponent,
        IntelligenceComponent
      ],
      providers: [
        AutocompleteService,
        SpeechService
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  it('should have an input element for search inputs', () => {
    let compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('div.input-group input#nav-input'));
  });

  it('should focus the input search element on initialization', () => {
    let compiled = fixture.debugElement.nativeElement;
    let inputElement: HTMLInputElement = compiled.querySelector('div.input-group input#nav-input');
    expect(document.activeElement).toBe(inputElement);
  });

  it('should have "searchdata" property', () => {
    let compiled = fixture.debugElement.nativeElement;

    expect(component.searchdata).toBeTruthy();
  });

  it('should have an app-auto-complete element', () => {
    let compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('app-auto-complete')).toBeTruthy();
  });

  it('should have search button', () => {
    let compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('button#nav-button')).toBeTruthy();
  });

  it('should have microphone icon', () => {
    let compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('img.microphone')).toBeTruthy();
  });

  it('should have wholequery$ as Observable', () => {
    expect(component.wholequery$).toBeTruthy();
  });

});
