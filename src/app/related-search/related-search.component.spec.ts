/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import * as fromRoot from '../reducers';

import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AppComponent } from '../app.component';
import { reducer } from '../reducers/index';
import { RelatedSearchComponent } from './related-search.component';
import {KnowledgeapiService} from "../knowledgeapi.service";
import {IntelligenceComponent} from "../intelligence/intelligence.component";


describe('RelatedSearchComponent', () => {
  let component: RelatedSearchComponent;
  let fixture: ComponentFixture<RelatedSearchComponent>;

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
        RelatedSearchComponent
      ],
      providers: [
        KnowledgeapiService
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatedSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  it('should display results if any, along with right keyword', () => {
    let knowledgeService = fixture.debugElement.injector.get(KnowledgeapiService);
    let compiled = fixture.debugElement.nativeElement;
    if (component.results.length > 0) {
      expect(compiled.querySelector('div.card'));
      expect(component.keyword).not.toBeNull('Keyword has not been initialized');
    }
  });

});


