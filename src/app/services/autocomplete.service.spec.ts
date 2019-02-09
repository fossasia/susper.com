/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { AutocompleteService } from './autocomplete.service';
import {HttpModule, JsonpModule} from "@angular/http";
import {StoreModule} from "@ngrx/store";
import {StoreDevtoolsModule} from "@ngrx/store-devtools";
import { environment } from '../../environments/environment';
import {reducer} from "../reducers/index";

describe('AutocompleteService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule,
        JsonpModule,
        StoreModule.provideStore(reducer),
        !environment.production ? StoreDevtoolsModule.instrument({ maxAge: 50 }) : [],
      ],
      providers: [AutocompleteService]
    });
  });

  it('should ...', inject([AutocompleteService], (service: AutocompleteService) => {
    expect(service).toBeTruthy();
  }));
});
