import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {HttpModule, JsonpModule} from "@angular/http";
import {StoreModule} from "@ngrx/store";

import { AutoCorrectComponent } from './auto-correct.component';
import {StoreDevtoolsModule} from "@ngrx/store-devtools";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {BrowserModule} from "@angular/platform-browser";
import {AutocorrectService} from "../services/autocorrect.service";
import {reducer} from "../reducers/index";
import {IntelligenceComponent} from "../intelligence/intelligence.component";
import { ThemeService } from '../services/theme.service';

describe('AutoCorrectComponent', () => {
  let component: AutoCorrectComponent;
  let fixture: ComponentFixture<AutoCorrectComponent>;

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
              AutoCorrectComponent,
              IntelligenceComponent
            ],
            providers: [
              AutocorrectService,
              ThemeService
            ]
        })
          .compileComponents();
      }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoCorrectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance of AutoCorrectComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should have query$ variable', () => {
    expect(component.query$).toBeTruthy();
  });

  it('should have resultsearch variable equal to "/search"', () => {
    expect(component.resultsearch).toEqual('/search');
  });

  it('should have resultscomponentchange$ variable as Observables', () => {
    expect(component.resultscomponentchange$).toBeTruthy();
  });
});
