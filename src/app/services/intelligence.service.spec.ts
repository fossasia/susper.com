import { TestBed, inject } from '@angular/core/testing';

import { IntelligenceService } from './intelligence.service';
import { JsonpModule} from "@angular/http";
import { HttpClientModule } from '@angular/common/http';
import {StoreModule} from "@ngrx/store";
import {reducer} from "../reducers/index";
import {StoreDevtoolsModule} from "@ngrx/store-devtools";

describe('IntelligenceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        JsonpModule,
        StoreModule.forRoot(reducer),
        StoreDevtoolsModule.instrument(),
      ],
      providers: [IntelligenceService]
    });
  });

  it('should ...', inject([IntelligenceService], (service: IntelligenceService) => {
    expect(service).toBeTruthy();
  }));
});
