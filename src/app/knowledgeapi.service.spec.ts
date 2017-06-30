/* tslint:disable:no-unused-variable */

import { TestBed, inject, async, fakeAsync, tick } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Http, Jsonp, BaseRequestOptions, RequestMethod, Response, ResponseOptions, HttpModule, JsonpModule } from '@angular/http';
import { StoreModule } from '@ngrx/store';
import { reducer } from './reducers/index';

import { KnowledgeapiService } from './knowledgeapi.service';

import { MockKnowledgeApi } from './shared/mock-backend/knowledge.mock';

const mockHttp_provider = {
  provide: Http,
  deps: [MockBackend, BaseRequestOptions],
  useFactory: (backend: MockBackend, options: BaseRequestOptions) => {
    return new Http(backend, options);
  }
};

describe('Service: KnowledgeapiService', () => {
  let service: KnowledgeapiService = null;
  let backend: MockBackend = null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        KnowledgeapiService,
        MockBackend,
        BaseRequestOptions,
        mockHttp_provider,
      ],
      imports: [
        HttpModule,
        JsonpModule,
        StoreModule.provideStore(reducer)
      ]
    });
  });

  beforeEach(inject([KnowledgeapiService, MockBackend], (knowledgeService: KnowledgeapiService, mockBackend: MockBackend) => {
    service = knowledgeService;
    backend = mockBackend;
  }));

  const searchquery = 'Berlin';
  const _queryResult = MockKnowledgeApi;

  it('should create an instance KnowledgeapiService',
    inject([KnowledgeapiService, MockBackend], () => {
      expect(service).toBeTruthy();
    })
  );

  it('should call knowledge service API and return the result', () => {
    backend.connections.subscribe((connection: MockConnection) => {
      const options = new ResponseOptions({
        body: JSON.stringify(MockKnowledgeApi)
      });

      connection.mockRespond(new Response(options));
      expect(connection.request.method).toEqual(RequestMethod.Get);
      expect(connection.request.url).toBe(
        `http://lookup.dbpedia.org/api/search/KeywordSearch` +
                    `?&QueryString=${searchquery}`
      );
    });

    service.getsearchresults(searchquery).subscribe((res) => {
      expect(res).toEqual(MockKnowledgeApi);
    });

  });

});
