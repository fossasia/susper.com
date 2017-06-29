import { TestBed, inject } from '@angular/core/testing';

import { AutoCorrectService } from './autocorrect.service';

describe('AutoCorrectService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AutoCorrectService]
    });
  });

  it('should be created', inject([AutoCorrectService], (service: AutoCorrectService) => {
    expect(service).toBeTruthy();
  }));
});
