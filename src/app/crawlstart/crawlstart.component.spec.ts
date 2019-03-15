import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CrawlstartComponent } from './crawlstart.component';
import { FormsModule } from '@angular/forms';
import { FooterNavbarComponent } from 'app/footer-navbar/footer-navbar.component';
import { CrawlstartService } from 'app/services/crawlstart.service';
import { url } from '../../assets/url_configuration';

describe('CrawlstartComponent', () => {
  let component: CrawlstartComponent;
  let fixture: ComponentFixture<CrawlstartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
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
  })

  it('should have susper url', () => {
    expect(component.susperUrl).toBe("susper.com")
  })

});
