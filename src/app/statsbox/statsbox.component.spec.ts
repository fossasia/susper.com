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

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
