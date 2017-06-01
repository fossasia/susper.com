import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By, BrowserModule } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AboutComponent } from './about.component';
import { FooterNavbarComponent } from '../footer-navbar/footer-navbar.component';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';
import { JsonpModule, HttpModule } from '@angular/http';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { reducer } from '../reducers/index';
import { FormsModule } from '@angular/forms';
import { AppComponent } from '../app.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { IndexComponent } from '../index/index.component';
import { ResultsComponent } from '../results/results.component';
import { NotFoundComponent } from '../not-found/not-found.component';
import { AdvancedsearchComponent } from '../advancedsearch/advancedsearch.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { ContactComponent } from '../contact/contact.component';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import {InfoboxComponent} from "../infobox/infobox.component";
import {RelatedSearchComponent} from "../related-search/related-search.component";
import {AutoCompleteComponent} from "../auto-complete/auto-complete.component";
import { ThemeComponent } from '../theme/theme.component';

describe('AboutComponent', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;

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
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
