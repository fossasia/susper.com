import { TestBed, inject } from '@angular/core/testing';
import { IntelligenceService } from './intelligence.service';
import {HttpModule, JsonpModule} from "@angular/http";
import {StoreModule} from "@ngrx/store";
import {reducer} from "../reducers/index";
import {StoreDevtoolsModule} from "@ngrx/store-devtools";
import { environment } from '../../environments/environment';

describe('IntelligenceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule,
        JsonpModule,
        StoreModule.forRoot(reducer),
        !environment.production ? StoreDevtoolsModule.instrument({ maxAge: 50 }) : [],
      ],
      providers: [IntelligenceService]
    });
  });

  it('should ...', inject([IntelligenceService], (service: IntelligenceService) => {
    expect(service).toBeTruthy();
  }));
});
