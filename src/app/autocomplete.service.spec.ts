/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { AutocompleteService } from './autocomplete.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('AutocompleteService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [AutocompleteService]
    });
  })
});
