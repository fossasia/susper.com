import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { StatsboxComponent } from './statsbox.component';
import {RouterTestingModule} from "@angular/router/testing";
import {HttpModule, JsonpModule} from "@angular/http";
import {StoreModule} from "@ngrx/store";
import {reducer} from "../reducers/index";
import {ChartsModule} from "ng2-charts";
import { ThemeService } from '../services/theme.service';
describe('StatsboxComponent', () => {
  let component: StatsboxComponent;
  let fixture: ComponentFixture<StatsboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpModule,
        JsonpModule,
        ChartsModule,
        StoreModule.provideStore(reducer),
      ],
      declarations: [
        StatsboxComponent,
      ],
      providers: [ThemeService]
    })
      .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(StatsboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create StatsboxComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should have querychange$ Observables', () => {
    expect(component.querychange$).toBeTruthy();
  });

  it('should have navigation$ Observables', () => {
    expect(component.navigation$).toBeTruthy();
  });

  it('should have searchresults$ Observables', () => {
    expect(component.searchresults$).toBeTruthy();
  });

  it('should have selectedelement number', () => {
    expect(component.selectedelement).toBeTruthy();
  });

  it('should have selectedelements Array', () => {
    expect(component.selectedelements).toBeTruthy();
  });

  it('should have querylook to be an object', () => {
    expect(component.querylook).toBeTruthy();
  });

  it('should have analyticsStatus variable declared as string', () => {
    expect(component.analyticsStatus).toBeTruthy();
  });
});
