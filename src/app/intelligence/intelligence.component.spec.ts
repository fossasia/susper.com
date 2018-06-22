import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {RouterTestingModule} from "@angular/router/testing";
import {BrowserModule} from "@angular/platform-browser";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {HttpModule, JsonpModule} from "@angular/http";
import {reducer} from "../reducers/index";
import {StoreModule} from "@ngrx/store";
import {IntelligenceComponent} from "../intelligence/intelligence.component";
import {IntelligenceService} from "../services/intelligence.service";
import { ThemeService } from '../services/theme.service';

describe('IntelligenceComponent', () => {
  let component: IntelligenceComponent;
  let fixture: ComponentFixture<IntelligenceComponent>;

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
      ],
      declarations: [
        IntelligenceComponent
      ],
      providers: [
        IntelligenceService,
        ThemeService
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntelligenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
