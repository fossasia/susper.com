import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoCompleteComponent } from './auto-complete.component';
import {AutocompleteService} from "../autocomplete.service";
import {RelatedSearchComponent} from "../related-search/related-search.component";
import {InfoboxComponent} from "../infobox/infobox.component";
import {ModalComponent} from "ng2-bs3-modal/components/modal";
import {ContactComponent} from "../contact/contact.component";
import {AboutComponent} from "../about/about.component";
import {FooterNavbarComponent} from "../footer-navbar/footer-navbar.component";
import {AppComponent} from "../app.component";
import {NavbarComponent} from "../navbar/navbar.component";
import {IndexComponent} from "../index/index.component";
import {ResultsComponent} from "../results/results.component";
import {NotFoundComponent} from "../not-found/not-found.component";
import {AdvancedsearchComponent} from "../advancedsearch/advancedsearch.component";
import {SearchBarComponent} from "../search-bar/search-bar.component";
import {StoreDevtoolsModule} from "@ngrx/store-devtools";
import {reducer} from "../reducers/index";
import {StoreModule} from "@ngrx/store";
import {JsonpModule, HttpModule} from "@angular/http";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {BrowserModule} from "@angular/platform-browser";
import {RouterTestingModule} from "@angular/router/testing";
import { ThemeComponent } from '../theme/theme.component';

describe('AutoCompleteComponent', () => {
  let component: AutoCompleteComponent;
  let fixture: ComponentFixture<AutoCompleteComponent>;

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
        StoreDevtoolsModule.instrumentOnlyWithExtension(),
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
      providers: [
       AutocompleteService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
