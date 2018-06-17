import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpModule, JsonpModule } from '@angular/http';
import { InfoboxComponent } from './infobox.component';
import { RouterTestingModule } from "@angular/router/testing";
import { ThemeService } from '../services/theme.service';
import { KnowledgeapiService } from "../services/knowledgeapi.service";
import { reducer } from "../reducers/index";
import { StoreModule } from "@ngrx/store";
import { MockKnowledgeApi } from "../shared/mocks/knowledge.mock";

describe('Component: InfoboxComponent', () => {
  let component: InfoboxComponent;
  let fixture: ComponentFixture<InfoboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpModule,
        JsonpModule,
        StoreModule.provideStore(reducer)
      ],
      declarations: [
        InfoboxComponent,
      ],
      providers: [
        { provide: KnowledgeapiService, useValue: MockKnowledgeApi },
        ThemeService
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoboxComponent);
    component = fixture.componentInstance;
    component.results = MockKnowledgeApi.results[0].query.pages;
    fixture.detectChanges();
  });

  it('should create Infobox component', () => {
    expect(component).toBeTruthy();
  });

  it('should have results variable declared as object', () => {
    expect(component.results).toBeTruthy();
  });

  it('should have content_response$ observables', () => {
    expect(component.content_response$).toBeTruthy();
  });

  it('should have image_response$ observables', () => {
    expect(component.image_response$).toBeTruthy();
  });

});
