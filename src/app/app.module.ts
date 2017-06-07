import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {HttpModule, JsonpModule} from '@angular/http';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { IndexComponent } from './index/index.component';
import { ResultsComponent } from './results/results.component';
import {Routes, RouterModule} from '@angular/router';
import {SearchService} from './search.service';
import { NotFoundComponent } from './not-found/not-found.component';
import {CommonModule} from '@angular/common';
import { AdvancedsearchComponent } from './advancedsearch/advancedsearch.component';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {StoreModule} from '@ngrx/store';
import {reducer} from './reducers/index';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { AboutComponent } from './about/about.component';
import { FooterNavbarComponent } from './footer-navbar/footer-navbar.component';
import { ContactComponent } from './contact/contact.component';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import { TermsComponent } from './terms/terms.component';
import {EffectsModule} from '@ngrx/effects';
import {ApiSearchEffects} from './effects/search-effects';
import { NewadvancedsearchComponent } from './newadvancedsearch/newadvancedsearch.component';
import { InfoboxComponent } from './infobox/infobox.component';
import {KnowledgeapiService} from './knowledgeapi.service';
import { RelatedSearchComponent } from './related-search/related-search.component';
import {AutocompleteService} from "./autocomplete.service";
import { AutoCompleteComponent } from './auto-complete/auto-complete.component';
import { ThemeComponent } from './theme/theme.component';
import { ThemeService } from './theme.service';
import {KnowledgeEffects} from "./effects/knowledge";


const appRoutes: Routes = [
  {path: 'search', component: ResultsComponent},
  {path: '', component: IndexComponent},
  {path: 'about', component: AboutComponent},
  {path: 'terms', component: TermsComponent},
  {path: 'contact', component: ContactComponent},
  {path: '404', component: NotFoundComponent},
  {path: 'advancedsearch', component: NewadvancedsearchComponent},
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
  providers: [SearchService, KnowledgeapiService, AutocompleteService, ThemeService],
  bootstrap: [AppComponent]
})
export class AppModule { }
