import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { JsonpModule} from "@angular/http";
import {StoreModule} from "@ngrx/store";
import {StoreDevtoolsModule} from "@ngrx/store-devtools";
import {reducer} from "../reducers/index";
import {AutocorrectService} from "./autocorrect.service";

describe('AutocorrectService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        JsonpModule,
        StoreModule.forRoot(reducer),
        StoreDevtoolsModule.instrument(),
      ],
      providers: [AutocorrectService]
    });
  });

  it('should be created', inject([AutocorrectService], (service: AutocorrectService) => {
    expect(service).toBeTruthy();
  }));
});
