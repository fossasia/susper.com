import { TestBed, inject } from '@angular/core/testing';

import { SocialmediaService } from './socialmedia.service';

describe('SocialmediaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SocialmediaService]
    });
  });

  it('should ...', inject([SocialmediaService], (service: SocialmediaService) => {
    expect(service).toBeTruthy();
  }));
});
