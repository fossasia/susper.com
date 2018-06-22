/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { IndexComponent } from './index/index.component';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ResultsComponent } from './results/results.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AdvancedsearchComponent } from './advancedsearch/advancedsearch.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { reducer } from './reducers/index';
import { FooterNavbarComponent } from './footer-navbar/footer-navbar.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { AutoCompleteComponent } from "./auto-complete/auto-complete.component";
import { ThemeComponent } from './theme/theme.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { IntelligenceComponent } from "./intelligence/intelligence.component";
import { SpeechtotextComponent } from "./speechtotext/speechtotext.component";
import { AutoCorrectComponent } from "./auto-correct/auto-correct.component";
import { StatsboxComponent } from "./statsbox/statsbox.component";
import { SpeechService } from "./services/speech.service";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { ChartsModule } from "ng2-charts";
import { InfoboxComponent } from './infobox/infobox.component';

describe('AppComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        InfiniteScrollModule,
        BrowserModule,
        CommonModule,
        FormsModule,
        HttpModule,
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
        IntelligenceComponent,
        SpeechtotextComponent,
        AutoCorrectComponent,
        StatsboxComponent,
        InfoboxComponent
      ],
      providers: [
        SpeechService
      ]
    });
    TestBed.compileComponents();
  });

  it('should create the app', async(() => {
    let fixture = TestBed.createComponent(AppComponent);
    let app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it(`should have as title 'Susper'`, async(() => {
    let fixture = TestBed.createComponent(AppComponent);
    let app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('Susper');
  }));

});
