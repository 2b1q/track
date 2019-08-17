import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

import { SAVED_ACTIVITIES, CURRENT_ACTIVITIES } from 'src/shared/tracks';
import {
  CurrentLatLng,
  IGeoJson,
  PositionInfo,
  TrackLog
} from 'src/shared/track.interface';

import * as mapboxgl from 'mapbox-gl';

import { Subject, from, Observable, of } from 'rxjs';
import { concatMap, delay } from 'rxjs/operators';

const apiToken = environment.api_token;
const DALAY_RENDERING = 2500;
// const delayFor20Seconds = () => timer(20000);

declare var omnivore: any;
declare var L: any;

const defaultCoords: number[] = [55.751244, 37.618423]; // MSK
const defaultZoom = 8;

@Injectable()
export class MapService {
  subject: Subject<CurrentLatLng>;
  $track: Observable<any>;

  $pointInfo: Subject<PositionInfo>;
  $trackLog: Subject<TrackLog>;

  private point: PositionInfo;
  private trackLog: TrackLog;

  // map-box properties
  private mapB: mapboxgl.Map;
  private start: IGeoJson;
  private end: IGeoJson;
  private allTrack: IGeoJson;
  private currentGeoPoint: IGeoJson;

  constructor() {
    this.subject = new Subject();
    this.$pointInfo = new Subject();
    this.$trackLog = new Subject();
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
    return CURRENT_ACTIVITIES.filter(track => track.id == id).pop();
  }

  // plot current track
  plotCurrentTrack(id: number, startPoint: number[]) {
    this.initMapBox(
      startPoint,
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
        .pipe(delay(2000))
        .pipe(concatMap(position => of(position).pipe(delay(DALAY_RENDERING))))
        .subscribe(
          currentPosition => {
            this.allTrack.geometry.coordinates.push(currentPosition);
            this.mapB.getSource('trace').setData(this.allTrack);
            this.mapB.panTo(currentPosition);
            // update current geo point
            this.currentGeoPoint.geometry.coordinates = currentPosition;
            this.point.passedPoints++;
            const timeStamp: number = new Date().getTime();
            this.point.timeStamp = timeStamp;
            this.point.timePassed = timeStamp - this.trackLog.timeStamp;
            this.$pointInfo.next(this.point);
            // console.log('this.point', this.point);
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
        // console.log(this.allTrack);
        this.start = target._layers[3].feature;
        this.end = target._layers[4].feature;
        this.currentGeoPoint = this.start;
        this.currentGeoPoint.properties = {}; // cleanup props

        // create initial track point info
        this.point = {
          point: this.currentGeoPoint,
          timeStamp: new Date().getTime(),
          timePassed: 0,
          passedPoints: 0,
          currentSpeed: 0,
          passedDistance: 0
        };

        // craete track log
        this.trackLog = {
          timeStamp: new Date().getTime(),
          totalPoints: this.allTrack.geometry.coordinates.length,
          startPoint: this.start,
          endPoint: this.end,
          points: []
        };

        // add first point to track log
        this.trackLog.points.push(this.point);

        // start track log
        this.$trackLog.next(this.trackLog);

        this.allTrack.geometry.coordinates.length = 0; // clear route GPX points
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
