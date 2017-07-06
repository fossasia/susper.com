import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Map} from 'leaflet';

@Injectable()
export class MapService {
  public map: Map;
  public baseMaps: any;
  private vtLayer: any;

  constructor(private http: Http) {
    this.baseMaps = {
      OpenStreetMap: L.tileLayer("http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
      }),
    };
  }

  disableMouseEvent(elementId: string) {
    let element = <HTMLElement>document.getElementById(elementId);

    L.DomEvent.disableClickPropagation(element);
    L.DomEvent.disableScrollPropagation(element);
  }
}
