/* Packages */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreModule } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { EffectsModule } from '@ngrx/effects';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';

/* Custom Components */
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { IndexComponent } from './index/index.component';
import { ResultsComponent } from './results/results.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AdvancedsearchComponent } from './advancedsearch/advancedsearch.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { AboutComponent } from './about/about.component';
import { FooterNavbarComponent } from './footer-navbar/footer-navbar.component';
import { ContactComponent } from './contact/contact.component';
import { TermsComponent } from './terms/terms.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { ApiSearchEffects } from './effects/search-effects';
import { NewadvancedsearchComponent } from './newadvancedsearch/newadvancedsearch.component';
import { AutoCompleteComponent } from './auto-complete/auto-complete.component';
import { ThemeComponent } from './theme/theme.component';
import { CrawlstartComponent } from './crawlstart/crawlstart.component';
import { SearchsettingsComponent } from './searchsettings/searchsettings.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { IntelligenceComponent } from './intelligence/intelligence.component';
import { SpeechtotextComponent } from './speechtotext/speechtotext.component';
import { AutoCorrectComponent } from './auto-correct/auto-correct.component';
import { StatsboxComponent } from './statsbox/statsbox.component';
import { InfoboxComponent } from './infobox/infobox.component';
import { KnowledgeEffects } from "./effects/knowledge";

/* Custom Services */
import { AutocompleteService } from "./services/autocomplete.service";
import { ThemeService } from './services/theme.service';
import { CrawlstartService } from "./services/crawlstart.service";
import { SpeechService } from './services/speech.service';
import { IntelligenceService } from "./services/intelligence.service";
import { AutocorrectService } from "./services/autocorrect.service";
import { SpeechSynthesisService } from './services/speech-synthesis.service';
import { KnowledgeapiService } from './services/knowledgeapi.service';
import { SearchService } from './services/search.service';
import { NewsService } from './services/news.service';
import { GetJsonService } from './services/get-json.service';
import { HelpComponent } from './help/help.component';

/* Reducers */
import { reducer } from './reducers/index';

const appRoutes: Routes = [
  {path: 'search', component: ResultsComponent},
  {path: '', component: IndexComponent},
  {path: 'about', component: AboutComponent},
  {path: 'privacy', component: PrivacyComponent},
  {path: 'terms', component: TermsComponent},
  {path: 'contact', component: ContactComponent},
  {path: '404', component: NotFoundComponent},
  {path: 'advancedsearch', component: NewadvancedsearchComponent},
  {path: 'crawlstartexpert', component: CrawlstartComponent},
  {path: 'preferences', component: SearchsettingsComponent },
  {path: 'help', component: HelpComponent},
  {path: '**', redirectTo: '/404'},
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    IndexComponent,
    ResultsComponent,
    NotFoundComponent,
    AdvancedsearchComponent,
    SearchBarComponent,
    AboutComponent,
    FooterNavbarComponent,
    ContactComponent,
    TermsComponent,
    PrivacyComponent,
    NewadvancedsearchComponent,
    AutoCompleteComponent,
    ThemeComponent,
    CrawlstartComponent,
    SearchsettingsComponent,
    DropdownComponent,
    IntelligenceComponent,
    SpeechtotextComponent,
    AutoCorrectComponent,
    StatsboxComponent,
    InfoboxComponent,
    HelpComponent,
  ],

  imports: [
    BrowserModule,
    InfiniteScrollModule,
    CommonModule,
    FormsModule,
    HttpModule,
    JsonpModule,
    RouterModule.forRoot(appRoutes),
    StoreModule.provideStore(reducer),
    EffectsModule.run(ApiSearchEffects),
    EffectsModule.run(KnowledgeEffects),
    StoreDevtoolsModule.instrumentOnlyWithExtension(),
    Ng2Bs3ModalModule,
    ChartsModule
  ],

  providers: [
    SearchService,
    AutocompleteService,
    ThemeService,
    SpeechService,
    CrawlstartService,
    IntelligenceService,
    AutocorrectService,
    SpeechSynthesisService,
    KnowledgeapiService,
    NewsService,
    GetJsonService
  ],

  bootstrap: [AppComponent]
})

export class AppModule { }
