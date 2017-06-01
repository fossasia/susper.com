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
import { SearchService } from '../search.service';
import { FooterNavbarComponent } from '../footer-navbar/footer-navbar.component';
import { AboutComponent } from '../about/about.component';
import { ModalComponent, Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ContactComponent } from '../contact/contact.component';
import {InfoboxComponent} from "../infobox/infobox.component";
import {KnowledgeapiService} from "../knowledgeapi.service";
import {RelatedSearchComponent} from "../related-search/related-search.component";
import {AutoCompleteComponent} from "../auto-complete/auto-complete.component";
import {AutocompleteService} from "../autocomplete.service";
import { ThemeComponent } from '../theme/theme.component';
import { ThemeService } from '../theme.service';

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
        JsonpModule,
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
        InfoboxComponent,
        RelatedSearchComponent,
        AutoCompleteComponent,
        ThemeComponent
      ],
      providers: [SearchService, KnowledgeapiService, AutocompleteService, ThemeService]
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

  it('should display all the search results', () => {
    let compiled = fixture.debugElement.nativeElement;
    let textResult = compiled.querySelector('div.text-result');

    expect(textResult).toBeTruthy();
  });

});
