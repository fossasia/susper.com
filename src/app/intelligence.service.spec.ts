import { TestBed, inject } from '@angular/core/testing';

import { IntelligenceService } from './intelligence.service';

describe('IntelligenceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IntelligenceService]
    });
  });

  it('should ...', inject([IntelligenceService], (service: IntelligenceService) => {
    expect(service).toBeTruthy();
  }));
});
