import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SpeechtotextComponent } from './speechtotext.component';
import { SpeechService } from "../services/speech.service";
import { StoreModule, Store } from "@ngrx/store";
import { reducer } from "../reducers/index";
import * as fromRoot from '../reducers';
import { RouterTestingModule } from "@angular/router/testing";

describe('SpeechtotextComponent', () => {
  let component: SpeechtotextComponent;
  let fixture: ComponentFixture<SpeechtotextComponent>;
  let message: any;
  let ticks: any;
  let timer: any;
  let subscription: any;
  let change: boolean;
  let borderheight;
  let borderwidth;
  let buttoncolor;
  let miccolor;
  let resultspage: boolean;
  let shadowleft: any;
  let shadowtop: any;
  let store: Store<fromRoot.State>;

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

  it('should message speak now', () => {
    message = component.message;
    expect(message).toBe("Speak Now");
  });

  it('ticks should equal zero', () => {
    ticks = component.ticks;
    expect(ticks).toBe(0);
  });

  it('should have change to be false', () => {
    change = component.change;
    expect(change).toBe(false);
  });

  it('should have borderheight equal to zero', () => {
    borderheight = component.borderheight;
    expect(borderheight).toBe(0);
  });

  it('should have borderwidth equal to zero', () => {
    borderwidth = component.borderwidth;
    expect(borderwidth).toBe(0);
  });

  it('should have buttoncolor equal to #fff', () => {
    buttoncolor = component.buttoncolor;
    expect(buttoncolor).toBe('#fff');
  });

  it('should have miccolor equal to #f44', () => {
    miccolor = component.miccolor;
    expect(miccolor).toBe('#f44');
  });

  it('should have shadowleft equal to -69px or -103px', () => {
    shadowleft = component.shadowleft;
    resultspage = component.resultspage;
    if (resultspage) {
      expect(shadowleft).toBe('-103px');
    } else {
      expect(shadowleft).toBe('-69px');
    }
  });

  it('should have shadowtop equal to -68px', () => {
    shadowtop = component.shadowtop;
    resultspage = component.resultspage;
    if (resultspage) {
      expect(shadowtop).toBe('-102px');
    } else {
      expect(shadowtop).toBe('-68px');
    }
  });

  it('should call hidespeech function on div click', () => {
    spyOn(component, 'hidespeech').and.callThrough();
    const divelement = document.getElementById('spch');
    divelement.click();
    expect(component.hidespeech).toHaveBeenCalled();
  });

  it('close button should close speech', () => {
    let compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('div.close-button')).toBeTruthy();
  })

  // should call the ngOnInit........

  it('should call functions after calling ngOnInit', () => {
    component.ngOnInit();
    if (ticks === 1) {
      expect(component.message).toBe('Listening...');
    } else if (ticks === 4) {
      expect(component.message).toBe('Please check your microphone and audio levels.');
      expect(component.miccolor).toBe('#C2C2C2');
    } else if (ticks === 6) {
      expect(component.subscription.unsubscribe()).toBeTruthy();
    }
  });

  it('should call resettimer function', () => {
    spyOn(component, 'resettimer');
    component.onquery(event);
    expect(component.resettimer).toHaveBeenCalled();
    expect(component.message).toBe(event);
  });

});
