import { TestBed, inject } from '@angular/core/testing';

import { AutoCorrectService } from './autocorrect.service';

import {HttpModule, JsonpModule} from "@angular/http";
import {StoreModule} from "@ngrx/store";
import {reducer} from "./reducers/index";
import {StoreDevtoolsModule} from "@ngrx/store-devtools";

describe('AutoCorrectService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule,
        JsonpModule,
        StoreModule.provideStore(reducer),
        StoreDevtoolsModule.instrumentOnlyWithExtension(),
      ],
      providers: [AutoCorrectService]
    });
  });

  it('should be created', inject([AutoCorrectService], (service: AutoCorrectService) => {
    expect(service).toBeTruthy();
  }));
});
