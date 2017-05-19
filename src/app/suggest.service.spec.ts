import { TestBed, inject } from '@angular/core/testing';

import { SuggestService } from './suggest.service';
import { HttpModule, JsonpModule } from '@angular/http';
import { reducer } from './reducers/index';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

describe('SuggestService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule,
        JsonpModule,
        StoreModule.provideStore(reducer),
        StoreDevtoolsModule.instrumentOnlyWithExtension()
      ],
      providers: [SuggestService]
    });
  });

  it('should be created', inject([SuggestService], (service: SuggestService) => {
    expect(service).toBeTruthy();
  }));
});
