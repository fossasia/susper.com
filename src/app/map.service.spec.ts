import { TestBed, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { MapService } from './map.service';
import { Map } from 'leaflet';
import L from 'leaflet';

describe('MapService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule,
        Map,
        L
      ],
      providers: [
        MapService
      ]
    });
  });

  it('should be created', inject([MapService], (service: MapService) => {
    expect(service).toBeTruthy();
  }));
});
