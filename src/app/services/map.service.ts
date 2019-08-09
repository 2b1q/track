import { Injectable } from '@angular/core';
import { TrackList } from 'src/shared/track-list.interface';
import { SAVED_ACTIVITIES } from 'src/shared/tracks';
import { Subject } from 'rxjs';
import { CurrentLatLng } from 'src/shared/map.interfaces';

const apiToken =
  'pk.eyJ1IjoiMmIxcSIsImEiOiJjanoxNnM5MnEwMmN6M2R0OXJyam4zdzY5In0.QLBIIA-E76JN0xELrLW4Cw';
declare var omnivore: any;
declare var L: any;

const defaultCoords: number[] = [40, -80];
const defaultZoom = 8;

@Injectable()
export class MapService {
  subject: Subject<CurrentLatLng>;

  constructor() {
    this.subject = new Subject();
  }

  getTrack(id: number) {
    return SAVED_ACTIVITIES.slice(0).find(run => run.id === id);
  }

  plotTrack(id: number) {
    const myStyle = {
      color: '#3949AB', // GPS track color
      weight: 5,
      opacity: 0.95
    };

    const map = L.map('map').setView(defaultCoords, defaultZoom);

    map.maxZoom = 100;

    L.tileLayer(
      'https://api.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}',
      {
        attribution:
          // tslint:disable-next-line:max-line-length
          'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        // id: 'mapbox.dark',
        id: 'mapbox.streets',
        accessToken: apiToken
      }
    ).addTo(map);

    const customLayer = L.geoJson(null, {
      style: myStyle
    });

    const gpxLayer = omnivore
      .gpx(
        SAVED_ACTIVITIES.slice(0).find(run => run.id === id).gpxData,
        null,
        customLayer
      )
      .on('ready', () => map.fitBounds(gpxLayer.getBounds()))
      .on('click', e => {
        onMapClick(e);
        const { latlng } = e;
        this.subject.next(latlng);
      })
      // .bindPopup('')
      // .openPopup()
      .addTo(map);

    function onMapClick(e) {
      L.popup()
        .setLatLng(e.latlng)
        .setContent(e.latlng.toString())
        .openOn(map);
    }

    // this.subject.subscribe(event => {
    //   L.marker([event.lat, event.lng]).addTo(map);
    // });
  }
}
