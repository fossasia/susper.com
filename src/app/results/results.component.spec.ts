/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By, BrowserModule } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ResultsComponent } from './results.component';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { reducer } from '../reducers/index';
import { AppComponent } from '../app.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { IndexComponent } from '../index/index.component';
import { NotFoundComponent } from '../not-found/not-found.component';
import { AdvancedsearchComponent } from '../advancedsearch/advancedsearch.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { FooterNavbarComponent } from '../footer-navbar/footer-navbar.component';
import { AboutComponent } from '../about/about.component';
import { ModalComponent, Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ContactComponent } from '../contact/contact.component';
import { AutoCompleteComponent } from "../auto-complete/auto-complete.component";
import { AutocompleteService } from "../services/autocomplete.service";
import { ThemeComponent } from '../theme/theme.component';
import { ThemeService } from '../services/theme.service';
import { SpeechService } from '../services/speech.service';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { IntelligenceComponent } from "../intelligence/intelligence.component";
import { IntelligenceService } from "../services/intelligence.service";
import { SpeechtotextComponent } from "../speechtotext/speechtotext.component";
import { AutoCorrectComponent } from "../auto-correct/auto-correct.component";
import { StatsboxComponent } from "../statsbox/statsbox.component";
import { AutocorrectService } from "../services/autocorrect.service";
import { SpeechSynthesisService } from "../services/speech-synthesis.service";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { ChartsModule } from "ng2-charts";
import { InfoboxComponent } from "../infobox/infobox.component";
import { KnowledgeapiService } from "../services/knowledgeapi.service";
import { GetJsonService } from '../services/get-json.service';
import { NewsService } from '../services/news.service';
import { SearchService } from '../services/search.service';
describe('ResultsComponent', () => {
  let component: ResultsComponent;
  let fixture: ComponentFixture<ResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        BrowserModule,
        CommonModule,
        FormsModule,
        HttpModule,
        InfiniteScrollModule,
        JsonpModule,
        ChartsModule,
        StoreModule.provideStore(reducer),
        StoreDevtoolsModule.instrumentOnlyWithExtension()
      ],
      declarations: [
        AppComponent,
        NavbarComponent,
        IndexComponent,
        ResultsComponent,
        NotFoundComponent,
        AdvancedsearchComponent,
        SearchBarComponent,
        FooterNavbarComponent,
        AboutComponent,
        ContactComponent,
        ModalComponent,
        AutoCompleteComponent,
        ThemeComponent,
        DropdownComponent,
        InfoboxComponent,
        IntelligenceComponent,
        SpeechtotextComponent,
        AutoCorrectComponent,
        StatsboxComponent,
        InfoboxComponent
      ],
      providers: [
        SearchService,
        AutocompleteService,
        ThemeService,
        SpeechService,
        IntelligenceService,
        AutocorrectService,
        SpeechSynthesisService,
        KnowledgeapiService,
        GetJsonService,
        NewsService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  it('should have an app-navbar element', () => {
    let compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('app-navbar')).toBeTruthy();
  });

  it('should have an app-advancedsearch element', () => {
    let compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('app-advancedsearch')).toBeTruthy();
  });

  it('should have an footer-navbar element', () => {
    let compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('app-footer-navbar')).toBeTruthy();
  });

  it('should have an app-theme element', () => {
    let compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('app-theme')).toBeTruthy();
  });

  it('should have an app-infobox element', () => {
        let compiled = fixture.debugElement.nativeElement;

        expect(compiled.querySelector('app-infobox')).toBeTruthy();
      });

  it('should have an app-infobox element', () => {
        let compiled = fixture.debugElement.nativeElement;

        expect(compiled.querySelector('app-infobox')).toBeTruthy();
      });


  it('should have a search options menu', () => {
    let compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('div#search-options-field ul#search-options'));
  });

  it('should have "items$" variable', () => {
    expect(component.items$).toBeTruthy();
  });

  it('should have a tool drop-down menu', () => {
    let compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('ul#tool-dropdown'));
  });

  it('should have a tool drop-down menu', () => {
    let compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('ul#setting-dropdown'));
  });

  it('should have a pagination bar', () => {
    let compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('div.pagination-bar'));
  });

  it('should have correctly related sub-components', () => {
    let compiled = fixture.debugElement.nativeElement;
    if (component.resultDisplay.toLocaleLowerCase() === 'all') {
      expect(compiled.querySelector('div.text-result div.title'));
      expect(compiled.querySelector('div.text-result div.link'));
      expect(compiled.querySelector('div.text-result div.description'));
    } else if (component.resultDisplay.toLocaleLowerCase() === 'images') {
      expect(compiled.querySelector('div.grid div.cell'));
      expect(compiled.querySelector('div.grid div.cell a.image-pointer'));
    } else if (component.resultDisplay.toLocaleLowerCase() === 'videos') {
      expect(compiled.querySelector('div.video-result div.title'));
      expect(compiled.querySelector('div.video-result div.link'));
    }
  });

  it('should have appropriate message', () => {
    let compiled = fixture.debugElement.nativeElement;
    if (component.totalNumber < 1) {
      expect(compiled.querySelector('div.noResults'));
    } else if  (component.totalNumber > 0) {
      expect(compiled.querySelector('div.message-bar'));
    }
  });

});
