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

const appRoutes: Routes = [
  {path: 'search', component: ResultsComponent},
  {path: '', component: IndexComponent},
 ];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    IndexComponent,
    ResultsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    JsonpModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [SearchService],
  bootstrap: [AppComponent]
})
export class AppModule { }
