import { TestBed, inject } from '@angular/core/testing';

import { SocialmediaService } from './socialmedia.service';
import {HttpModule, JsonpModule} from "@angular/http";
import {StoreModule} from "@ngrx/store";
import {StoreDevtoolsModule} from "@ngrx/store-devtools";
import {reducer} from "./reducers/index";

describe('SocialmediaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule,
        JsonpModule,
        StoreModule.provideStore(reducer),
        StoreDevtoolsModule.instrumentOnlyWithExtension(),
      ],
      providers: [SocialmediaService]
    });
  });


});
