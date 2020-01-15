/* tslint:disable:no-unused-variable */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';

/**
 * To avoid error 'No provider for Store'
 * import StoreModule and reducer
 */
import { reducer } from '../reducers/index';
import { StoreModule } from '@ngrx/store';

import { AdvancedsearchComponent } from './advancedsearch.component';

describe('AdvancedsearchComponent', () => {
  let component: AdvancedsearchComponent;
  let fixture: ComponentFixture<AdvancedsearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FormsModule,
        HttpModule,
        JsonpModule,
        StoreModule.provideStore(reducer)
      ],
      declarations: [
        AdvancedsearchComponent
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedsearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an advanced search instance', () => {
    expect(component).toBeTruthy();
  });

  it('should have advance search modal', () => {
    const compiled = fixture.debugElement.nativeElement;

    const button = compiled.querySelector('button');
    button.click();
    const modalBody: HTMLInputElement = compiled.querySelector('div.modal-body');
    expect(modalBody).toBeTruthy();
  });
});
