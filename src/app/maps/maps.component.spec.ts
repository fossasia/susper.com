import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LeafletModule } from '@asymmetrik/angular2-leaflet';
import { MapsComponent } from './maps.component';
import {MapService} from "../map.service";
import {HttpModule} from "@angular/http";

describe('MapsComponent', () => {
  let component: MapsComponent;
  let fixture: ComponentFixture<MapsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        LeafletModule,
        HttpModule
      ],
      declarations: [ MapsComponent ],
      providers: [MapService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
