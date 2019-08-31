import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MapService } from '../services/map.service';
import { TrackLog, Snapshot, CurrentLatLng, SnapshotData, PositionInfo, AxisLoads } from 'src/shared/track.interface';
import { AxisService } from 'src/shared/axis.service';
import { SAVED_SNAPSHOTS } from 'src/shared/tracks';

import * as mapboxgl from 'mapbox-gl';

declare var Hls;

@Component({
  selector: 'app-track',
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.css']
})
export class TrackComponent implements OnInit {
  // @ViewChild('video', { static: false }) divVideo: ElementRef;

  activity: any;
  myInnerHeight: string;
  gpx: any;
  trackLog: TrackLog;
  startPoint: CurrentLatLng;
  metersPassed: number;

  // currentPositionInfo
  snapshot: Snapshot;
  currentLatLng: CurrentLatLng;
  totalWeight: number;
  cargoWeight: number;
  vehicleWeight: number;
  data: SnapshotData[];
  positionInfo: PositionInfo;
  loaded = false;
  driveMode = true;
  loading = 0;
  isLoading = false;
  currentLoads: AxisLoads;

  // toggles
  private panToToggle: boolean;
  private axelToggle: boolean;

  constructor(private route: ActivatedRoute, private mapService: MapService, private axis: AxisService) {
    this.axelToggle = false;
    this.panToToggle = true;
    this.myInnerHeight = `${window.innerHeight - 300}px !important`;
  }

  addRandom(min, max): number {
    return Math.round(Math.random() * (max - min) + min);
  }

  // ngAfterViewInit(): void {
  //   if (Hls.isSupported()) {
  //     const hls = new Hls();
  //     // hls.loadSource('http://shumov-ag.fvds.ru/1/stream/0/live.m3u8');
  //     hls.loadSource(
  //       'http://iphone-streaming.ustream.tv/uhls/17074538/streams/live/iphone/playlist.m3u8'
  //     );
  //     hls.attachMedia(this.divVideo);
  //     hls.on(Hls.Events.MANIFEST_PARSED, function() {
  //       this.divVideo.play();
  //     });
  //   }
  // }

  togglePanTo() {
    this.panToToggle = this.mapService.togglePanTo();
  }

  toggleLoads() {
    this.axelToggle = !this.axelToggle;
  }

  ngOnInit() {
    this.panToToggle = this.mapService.getPanToState();

    // const { id: trackId } = this.route.snapshot.params;
    const trackId = 2;
    this.activity = this.mapService.getCurrentTrack(trackId);
    const { snapshotId, startPoint, gpxData } = this.activity;
    // set start point positon
    this.startPoint = {
      lat: startPoint[0],
      lng: startPoint[1]
    };
    // set GPX track data
    this.gpx = gpxData;
    this.mapService.plotCurrentTrack(trackId, startPoint);

    console.log(`display current activity ID ${trackId}`, this.activity);

    // update real time track info
    this.mapService.$trackLog.subscribe(track => {
      console.log('create track', track);
      this.trackLog = track;
      this.snapshot = SAVED_SNAPSHOTS[snapshotId - 1];
    });

    // update dynamic point info
    this.mapService.$pointInfo.subscribe(point => {
      // <trkpt lat="55.449418" lon = "37.767726" >
      // get current position
      const [lng, lat] = point.point.geometry.coordinates;
      point.snapshot = this.snapshot;

      this.positionInfo = point;
      this.positionInfo.point.geometry.coordinates = [lng, lat];
      this.currentLatLng = { lat, lng };
      // set current loads to empty values
      this.currentLoads = this.snapshot.emptyLoads;

      // update liveloads
      if (lat === 55.449418 && lng === 37.767726) {
        console.log('Load point reached');
        this.driveMode = false;
        this.loading += 1;
        // wait 10 point before loading
        if (this.loading <= 10) {
          this.isLoading = true;
          point.snapshot.data = this.axis.getLoadsFromCurrentWeight(this.currentLoads);
          // total waitiong 210 points
        } else if (this.loading >= 200) {
          // set as loaded
          this.loaded = true;
          this.isLoading = false;
          this.loading = 0;
        } else {
          // lift a1
          if (this.currentLoads.a1 < this.snapshot.notEmptyLoads.a1) {
            // tslint:disable-next-line:no-unused-expression
            this.currentLoads.a1 += this.addRandom(10, 50);
          }
          // lift a2
          if (this.currentLoads.a2 < this.snapshot.notEmptyLoads.a2) {
            // tslint:disable-next-line:no-unused-expression
            this.currentLoads.a2 += this.addRandom(10, 50);
          }
          // lift a3
          if (this.currentLoads.a3 < this.snapshot.notEmptyLoads.a3) {
            // tslint:disable-next-line:no-unused-expression
            this.currentLoads.a3 += this.addRandom(10, 50);
          }
          // lift a4
          if (this.currentLoads.a4 < this.snapshot.notEmptyLoads.a4) {
            // tslint:disable-next-line:no-unused-expression
            this.currentLoads.a4 += this.addRandom(10, 50);
          }
          // lift a5
          if (this.currentLoads.a5 < this.snapshot.notEmptyLoads.a5) {
            // tslint:disable-next-line:no-unused-expression
            this.currentLoads.a5 += this.addRandom(10, 50);
          }

          // console.log('this.currentLoads', this.currentLoads);
          point.snapshot.data = this.axis.getLoadsFromCurrentWeight(this.currentLoads);
        }
      } else if (lat === 51.630542 && lng === 39.25658) {
        this.driveMode = false;
        // this.isLoading = true;
        // <trkpt lat="51.630542" lon="39.256580">
        console.log('Unload point reached');
        this.loading += 1;
        if (this.loading > 5) {
          console.log('Unloading...');
          // unloading
          // unlift a1
          if (this.currentLoads.a1 > this.snapshot.emptyLoads.a1) {
            // tslint:disable-next-line:no-unused-expression
            this.currentLoads.a1 -= this.addRandom(10, 50);
          }
          // unlift a2
          if (this.currentLoads.a2 > this.snapshot.emptyLoads.a2) {
            // tslint:disable-next-line:no-unused-expression
            this.currentLoads.a2 -= this.addRandom(10, 50);
          }
          // unlift a3
          if (this.currentLoads.a3 > this.snapshot.emptyLoads.a3) {
            // tslint:disable-next-line:no-unused-expression
            this.currentLoads.a3 -= this.addRandom(10, 50);
          }
          // unlift a4
          if (this.currentLoads.a4 > this.snapshot.emptyLoads.a4) {
            // tslint:disable-next-line:no-unused-expression
            this.currentLoads.a4 -= this.addRandom(10, 50);
          }
          // unlift a5
          if (this.currentLoads.a5 > this.snapshot.emptyLoads.a5) {
            // tslint:disable-next-line:no-unused-expression
            this.currentLoads.a5 -= this.addRandom(10, 50);
          }
        } else if (this.loading >= 70) {
          this.loaded = false;
          // this.isLoading = false;
          // this.unloaded = true;
        }

        // if (this.isLoading) {
        console.log('this.currentLoads', this.currentLoads);
        point.snapshot.data = this.axis.getLoadsFromCurrentWeight(this.currentLoads);
        // }
      } else {
        this.driveMode = true;
      }

      if (this.driveMode) {
        if (this.loaded === true) {
          point.snapshot.data = this.axis.getLoadsFromCurrentWeight(this.snapshot.notEmptyLoads);
        } else {
          point.snapshot.data = this.axis.getLoadsFromCurrentWeight(this.snapshot.emptyLoads);
        }
      }

      // calculate total weight from current dynamic
      this.totalWeight = Object.values(point.snapshot.data)
        .map(({ weight }) => weight)
        .reduce((acc, cv) => acc + cv);

      const cargoWeight = this.totalWeight - this.snapshot.vehicleEmptyWeight;
      if (cargoWeight >= 50) {
        this.cargoWeight = cargoWeight;
      }

      // calculate current speed
      this.positionInfo.currentSpeed = 0;
      const currentSpeed = this.axis.getCurrentSpeed(this.positionInfo.timeStamp, this.currentLatLng);
      this.positionInfo.currentSpeed = Math.round(currentSpeed);

      // calculate passed distance
      this.metersPassed = this.axis.getDistance(this.startPoint, this.currentLatLng);

      this.positionInfo.passedDistance = Math.floor(this.metersPassed / 1000);
      // console.log('current moment speed: ', currentSpeed);
      // console.log('current AVG speed: ', this.positionInfo.currentSpeed);
      // console.log('meters passed ', this.metersPassed);
      // console.log('km passed ', this.positionInfo.passedDistance);
      // Log current positionInfo
      this.trackLog.points.push(this.positionInfo);
    });

    // add map event handlers
    const map = this.mapService.mapB;
    map
      // on layer 'trace' click event handler
      .on('click', 'trace', e => {
        let data = this.trackLog.points.find(
          point =>
            point.point.geometry.coordinates[0].toFixed(3) === e.lngLat.lng.toFixed(3) &&
            point.point.geometry.coordinates[1].toFixed(3) === e.lngLat.lat.toFixed(3)
        );
        // hard mode GEO point comparer
        if (!data) {
          data = this.trackLog.points.find(
            point =>
              point.point.geometry.coordinates[0].toFixed(2) === e.lngLat.lng.toFixed(2) &&
              point.point.geometry.coordinates[1].toFixed(2) === e.lngLat.lat.toFixed(2)
          );
        }
        console.log('position data', data);
        if (data) {
          new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(
              `
            <br><h6 style="font-size:14px;color:#777;">Скорость: <span style="font-size:16px;color:#444;">${data.currentSpeed}</span> км/ч</h6>
            <h6 style="font-size:14px;color:#777; margin-top: 20px;">Осевая нагрузка:</h6>
            <h6 style="font-size:14px;color:#777;"> &nbsp;ось 1: <span style="margin-left: 10px; font-size:14px;color:#444;">${data.snapshot.data[0].weight}</span> кг</h6>
            <h6 style="font-size:14px;color:#777;"> &nbsp;ось 2: <span style="margin-left: 10px; font-size:14px;color:#444;">${data.snapshot.data[1].weight}</span> кг</h6>
            <h6 style="font-size:14px;color:#777;"> &nbsp;ось 3: <span style="margin-left: 10px; font-size:14px;color:#444;">${data.snapshot.data[2].weight}</span> кг</h6>
            <h6 style="font-size:14px;color:#777;"> &nbsp;ось 4: <span style="margin-left: 10px; font-size:14px;color:#444;">${data.snapshot.data[3].weight}</span> кг</h6>
            <h6 style="font-size:14px;color:#777;"> &nbsp;ось 5: <span style="margin-left: 10px; font-size:14px;color:#444;">${data.snapshot.data[4].weight}</span> кг</h6>

            `
            )
            .addTo(map);
        }
      })
      // Change the cursor to a pointer when the mouse is over the trace layer.
      .on('mouseenter', 'trace', () => (map.getCanvas().style.cursor = 'pointer'))
      // Change it back to a pointer when it leaves.
      .on('mouseleave', 'trace', () => (map.getCanvas().style.cursor = ''));
  }
}
