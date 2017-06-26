import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpModule, JsonpModule } from '@angular/http';
import { reducer } from '../reducers/index';
import { StoreModule } from '@ngrx/store';
import { InfoboxComponent } from './infobox.component';
import { RouterTestingModule } from "@angular/router/testing";
import { KnowledgeapiService } from "../knowledgeapi.service";

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
        InfoboxComponent
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

  it('should create an InfoboxComponent', () => {
    expect(component).toBeTruthy();
  });

});
