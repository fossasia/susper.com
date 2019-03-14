import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrawlstartComponent } from './crawlstart.component';

describe('CrawlstartComponent', () => {
  let component: CrawlstartComponent;
  let fixture: ComponentFixture<CrawlstartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrawlstartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrawlstartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy() ;
  })

  it('should have susper url', () => {
    expect(component.susperUrl).toBe("susper.com")
  })

});
