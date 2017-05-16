import { TestBed, inject } from '@angular/core/testing';

import { KnowledgeapiService } from './knowledgeapi.service';
import {HttpModule, JsonpModule} from "@angular/http";
import {reducer} from "./reducers/index";
import {StoreModule} from "@ngrx/store";
import {StoreDevtoolsModule} from "@ngrx/store-devtools";

describe('KnowledgeapiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule,
        JsonpModule,
        StoreModule.provideStore(reducer),
        StoreDevtoolsModule.instrumentOnlyWithExtension(),
      ],
      providers: [KnowledgeapiService]
    });
  });

  it('should ...', inject([KnowledgeapiService], (service: KnowledgeapiService) => {
    expect(service).toBeTruthy();
  }));
});
