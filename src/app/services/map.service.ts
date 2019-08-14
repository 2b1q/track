import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

import { SAVED_ACTIVITIES, CURRENT_ACTIVITIES } from 'src/shared/tracks';
import { CurrentLatLng, IGeoJson } from 'src/shared/track.interface';

import * as mapboxgl from 'mapbox-gl';

import { Subject, from, Observable, of } from 'rxjs';
import { concatMap, delay } from 'rxjs/operators';

const apiToken = environment.api_token;
declare var omnivore: any;
declare var L: any;

const defaultCoords: number[] = [55.751244, 37.618423]; // MSK
const defaultZoom = 8;

@Injectable()
export class MapService {
  subject: Subject<CurrentLatLng>;
  $track: Observable<any>;

  $pointInfo: Observable<any>;

  // map-box properties
  private mapB: mapboxgl.Map;
  private start: IGeoJson;
  private end: IGeoJson;
  private allTrack: IGeoJson;

  constructor() {
    this.subject = new Subject();
  }

  initMapBox(coord: Array<number>, style: string) {
    // default settings
    mapboxgl.accessToken = apiToken;
    this.mapB = new mapboxgl.Map({
      container: 'map',
      style,
      zoom: 13,
      center: coord
    });
  }

  // get track from SAVED_ACTIVITIES
  getTrack(id: number) {
    return SAVED_ACTIVITIES.slice(0).find(run => run.id === id);
  }

  getCurrentTrack(id: number) {
    // tslint:disable-next-line:triple-equals
    return CURRENT_ACTIVITIES.filter(track => track.id == id);
  }

  // plot current track
  plotCurrentTrack(id: number) {
    this.initMapBox(
      [37.618423, 55.751244],
      'mapbox://styles/mapbox/outdoors-v9'
      // 'mapbox://styles/mapbox/satellite-v9'
    );
    this.mapB.on('load', () => {
      console.log('on load');
      console.log('this.start', this.start);
      console.log('this.end', this.end);
      this.mapB.addSource('trace', {
        type: 'geojson',
        data: this.allTrack
      });

      this.mapB.addLayer({
        id: 'trace',
        type: 'line',
        source: 'trace',
        paint: {
          'line-color': 'red',
          'line-opacity': 0.75,
          'line-width': 5
        }
      });

      this.mapB.jumpTo({ center: this.start.geometry.coordinates, zoom: 14 });
      this.mapB.setPitch(30);
      this.$track
        .pipe(delay(3000))
        .pipe(concatMap(position => of(position).pipe(delay(200))))
        .subscribe(
          currentPosition => {
            this.allTrack.geometry.coordinates.push(currentPosition);
            this.mapB.getSource('trace').setData(this.allTrack);
            this.mapB.panTo(currentPosition);
            // console.log(currentPosition);
          },
          err => console.error('building track error: ', err),
          () => {
            console.log('track Builded');
          }
        );
    });

    // load GPX
    omnivore
      // tslint:disable-next-line:triple-equals
      .gpx(CURRENT_ACTIVITIES.filter(run => run.id == id)[0].gpxData, null)
      .on('ready', ({ target }) => {
        console.log('GPX ready');
        this.allTrack = target._layers[1].feature;
        this.allTrack.geometry.coordinates.length = 0; // clear route
        // console.log(this.allTrack);
        this.start = target._layers[3].feature;
        this.end = target._layers[4].feature;
        // create Observable stream
        this.$track = from(
          target._layers[1]._latlngs.map(({ lat, lng }) => [lng, lat])
        );
      });
  }

  // plot track from history
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
      .addTo(map);

    function onMapClick(e) {
      L.popup()
        .setLatLng(e.latlng)
        .setContent(e.latlng.toString())
        .openOn(map);
    }
  }
}
