import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { IndexComponent } from './index/index.component';
import { ResultsComponent } from './results/results.component';
import { Routes, RouterModule } from '@angular/router';
import { SearchService } from './search.service';
import { NotFoundComponent } from './not-found/not-found.component';
import { CommonModule } from '@angular/common';
import { AdvancedsearchComponent } from './advancedsearch/advancedsearch.component';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreModule } from '@ngrx/store';
import { reducer } from './reducers/index';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { AboutComponent } from './about/about.component';
import { FooterNavbarComponent } from './footer-navbar/footer-navbar.component';
import { ContactComponent } from './contact/contact.component';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import { TermsComponent } from './terms/terms.component';
import { EffectsModule } from '@ngrx/effects';
import { ApiSearchEffects } from './effects/search-effects';
import { NewadvancedsearchComponent } from './newadvancedsearch/newadvancedsearch.component';
import { InfoboxComponent } from './infobox/infobox.component';
import { KnowledgeapiService } from './knowledgeapi.service';
import { RelatedSearchComponent } from './related-search/related-search.component';
import { AutocompleteService } from "./autocomplete.service";
import { AutoCompleteComponent } from './auto-complete/auto-complete.component';
import { ThemeComponent } from './theme/theme.component';
import { ThemeService } from './theme.service';
import { CrawlstartComponent } from './crawlstart/crawlstart.component';
import { CrawlstartService } from "./crawlstart.service";
import { SearchsettingsComponent } from './searchsettings/searchsettings.component';
import { KnowledgeEffects } from "./effects/knowledge";
import { SpeechService } from './speech.service';
import { DropdownComponent } from './dropdown/dropdown.component';
import { IntelligenceComponent } from './intelligence/intelligence.component';
import {IntelligenceService} from "./intelligence.service";
import { SpeechtotextComponent } from './speechtotext/speechtotext.component';
import { AutoCorrectComponent } from './auto-correct/auto-correct.component';
import {AutocorrectService} from "./autocorrect.service";
import { SpeechSynthesisService } from './speech-synthesis.service';

const appRoutes: Routes = [
  {path: 'search', component: ResultsComponent},
  {path: '', component: IndexComponent},
  {path: 'about', component: AboutComponent},
  {path: 'terms', component: TermsComponent},
  {path: 'contact', component: ContactComponent},
  {path: '404', component: NotFoundComponent},
  {path: 'advancedsearch', component: NewadvancedsearchComponent},
  {path: 'crawlstartexpert', component: CrawlstartComponent},
  {path: 'preferences', component: SearchsettingsComponent },
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
    NewadvancedsearchComponent,
    InfoboxComponent,
    RelatedSearchComponent,
    AutoCompleteComponent,
    ThemeComponent,
    CrawlstartComponent,
    SearchsettingsComponent,
    DropdownComponent,
    IntelligenceComponent,
    SpeechtotextComponent,
    AutoCorrectComponent,
  ],

  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpModule,
    JsonpModule,
    RouterModule.forRoot(appRoutes),
    StoreModule.provideStore(reducer),
    EffectsModule.run(ApiSearchEffects),
    EffectsModule.run(KnowledgeEffects),
    StoreDevtoolsModule.instrumentOnlyWithExtension(),
    Ng2Bs3ModalModule
  ],

  providers: [
    SearchService,
    KnowledgeapiService,
    AutocompleteService,
    ThemeService,
    SpeechService,
    CrawlstartService,
    IntelligenceService,
    AutocorrectService,
    SpeechSynthesisService
  ],

  bootstrap: [AppComponent]

})
export class AppModule { }
