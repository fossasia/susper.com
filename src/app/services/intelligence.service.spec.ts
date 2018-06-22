import { TestBed, inject } from '@angular/core/testing';
import { IntelligenceService } from './intelligence.service';
import {HttpModule, JsonpModule} from "@angular/http";
import {StoreModule} from "@ngrx/store";
import {reducer} from "../reducers/index";
import {StoreDevtoolsModule} from "@ngrx/store-devtools";

describe('IntelligenceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule,
        JsonpModule,
        StoreModule.provideStore(reducer),
        StoreDevtoolsModule.instrumentOnlyWithExtension(),
      ],
      providers: [IntelligenceService]
    });
  });

  it('should ...', inject([IntelligenceService], (service: IntelligenceService) => {
    expect(service).toBeTruthy();
  }));
});
