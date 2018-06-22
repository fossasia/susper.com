import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeechtotextComponent } from './speechtotext.component';
import { SpeechService } from "../services/speech.service";
import { StoreModule } from "@ngrx/store";
import { reducer } from "../reducers/index";
import { RouterTestingModule } from "@angular/router/testing";

describe('SpeechtotextComponent', () => {
  let component: SpeechtotextComponent;
  let fixture: ComponentFixture<SpeechtotextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        StoreModule.provideStore(reducer),
      ],
      declarations: [ SpeechtotextComponent ],
      providers: [SpeechService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeechtotextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
