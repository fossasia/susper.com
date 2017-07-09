import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeechtotextComponent } from './speechtotext.component';
import {SpeechService} from "../speech.service";
import {StoreModule} from "@ngrx/store";
import {reducer} from "../reducers/index";

describe('SpeechtotextComponent', () => {
  let component: SpeechtotextComponent;
  let fixture: ComponentFixture<SpeechtotextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
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
