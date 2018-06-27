import { TestBed, inject } from '@angular/core/testing';

import { GetJsonService } from './get-json.service';

describe('GetJsonService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GetJsonService]
    });
  });

  it('should be created', inject([GetJsonService], (service: GetJsonService) => {
    expect(service).toBeTruthy();
  }));
});
