import { TestBed, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { GeocodingService } from './geocoding.service';

describe('GeocodingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule
      ],
      providers: [
        GeocodingService,
      ]
    });
  });

  it('should be created', inject([GeocodingService], (service: GeocodingService) => {
    expect(service).toBeTruthy();
  }));
});
