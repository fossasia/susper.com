import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CrawlstartComponent } from './crawlstart.component';
import { FormsModule } from '@angular/forms';
import { FooterNavbarComponent } from 'app/footer-navbar/footer-navbar.component';
import { CrawlstartService } from 'app/services/crawlstart.service';
import { url } from '../../assets/url_configuration';
import { Component, OnInit } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';


describe('CrawlstartComponent', () => {
  let component: CrawlstartComponent;
  let fixture: ComponentFixture<CrawlstartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FormsModule
      ],
      declarations: [ CrawlstartComponent, FooterNavbarComponent ],
      providers: [CrawlstartService]
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
  });

  it('should create susperUrl', () => {
    expect(component.susperUrl).toBe('susper.com') ;
  });

  it('should create yacySearchlabUrl', () => {
    expect(component.yacySearchlabUrl).toBe('yacy.searchlab.eu');
  });

  it('should create yacyWebSearchUrl', () => {
    expect(component.yacyWebSearchUrl).toBe('yacy-websearch.net');
  });

  it('should call startcrawlJob', () => {
    expect(component.startCrawlJob).toHaveBeenCalled();
  });

  it('should call startcrawljob after a click', () => {
    spyOn(component, 'startCrawlJob').and.callThrough();
    const divButton = document.getElementById('crawlStartBtn');
    divButton.click();
  });

  it('should do... after calling function', () => {
    component.startCrawlJob();
    // check for
  });
});
