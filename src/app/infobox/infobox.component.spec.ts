import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpModule, JsonpModule } from '@angular/http';
import { InfoboxComponent } from './infobox.component';
import { RouterTestingModule } from "@angular/router/testing";

import { KnowledgeapiService } from "../knowledgeapi.service";
import { reducer } from "../reducers/index";
import { StoreModule } from "@ngrx/store";

describe('Component: InfoboxComponent', () => {
  let component: InfoboxComponent;
  let fixture: ComponentFixture<InfoboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpModule,
        JsonpModule,
        StoreModule.provideStore(reducer),
      ],
      declarations: [
        InfoboxComponent,
      ],
      providers: [
        KnowledgeapiService,
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create Infobox component', () => {
    expect(component).toBeTruthy();
  });

  it('should have infobox heading same as query', () => {
    let compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('h2.heading')).toBeTruthy();
  });

  it('should have infobox description related to query', () => {
    let compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('p.description')).toBeTruthy();
  });

  it('should have related searches', () => {
    let compiled = fixture.debugElement.nativeElement;

    expect(compiled.querySelector('.card div#relate')).toBeTruthy();
  });

  it('should have results variable declared as Array<any>', () => {
    expect(component.results).toBeTruthy();
  });

  it('should have response$ observables', () => {
    expect(component.response$).toBeTruthy();
  });

});
