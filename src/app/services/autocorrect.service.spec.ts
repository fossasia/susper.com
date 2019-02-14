import { TestBed, inject } from '@angular/core/testing';
import {HttpModule, JsonpModule} from "@angular/http";
import {StoreModule} from "@ngrx/store";
import {StoreDevtoolsModule} from "@ngrx/store-devtools";
import { environment } from '../../environments/environment';
import {reducer} from "../reducers/index";
import {AutocorrectService} from "./autocorrect.service";

describe('AutocorrectService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule,
        JsonpModule,
        StoreModule.forRoot(reducer),
        !environment.production ? StoreDevtoolsModule.instrument() : [],
      ],
      providers: [AutocorrectService]
    });
  });

  it('should be created', inject([AutocorrectService], (service: AutocorrectService) => {
    expect(service).toBeTruthy();
  }));
});
