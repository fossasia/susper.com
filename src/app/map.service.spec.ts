import { TestBed, inject } from '@angular/core/testing';

import { MapService } from './map.service';
import {HttpModule} from "@angular/http";

describe('MapService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [  HttpModule,
      ],
      providers: [MapService]
    });
  });

  it('should ...', inject([MapService], (service: MapService) => {
    expect(service).toBeTruthy();
  }));
});
