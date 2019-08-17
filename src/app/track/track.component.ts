import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MapService } from '../services/map.service';
import {
  TrackLog,
  Snapshot,
  CurrentLatLng,
  SnapshotData,
  PositionInfo,
  AxisLoads
} from 'src/shared/track.interface';
import { AxisService } from 'src/shared/axis.service';
import { SAVED_SNAPSHOTS } from 'src/shared/tracks';

@Component({
  selector: 'app-track',
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.css']
})
export class TrackComponent implements OnInit {
  activity: any;
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
  loading = 0;
  currentLoads: AxisLoads;

  constructor(
    private route: ActivatedRoute,
    private mapService: MapService,
    private axis: AxisService
  ) {}

  addRandom(min, max): number {
    return Math.round(Math.random() * (max - min) + min);
  }

  ngOnInit() {
    const { id: trackId } = this.route.snapshot.params;
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

      this.trackLog.points.push(point);
      this.positionInfo = point;
      this.positionInfo.point.geometry.coordinates = [lng, lat];
      this.currentLatLng = { lat, lng };
      // set current loads to empty values
      this.currentLoads = this.snapshot.emptyLoads;

      // update liveloads
      if (lat === 55.449418 && lng === 37.767726) {
        console.log('Load point reached');
        this.loading += 1;
        // wait 10 point before loading
        if (this.loading <= 10) {
          point.snapshot.data = this.axis.getLoadsFromCurrentWeight(
            this.currentLoads
          );
          // total waitiong 210 points
        } else if (this.loading === 200) {
          // set as loaded
          this.loaded = true;
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

          console.log('this.currentLoads', this.currentLoads);
          point.snapshot.data = this.axis.getLoadsFromCurrentWeight(
            this.currentLoads
          );
        }
        // } else if (lat !== 55.449418 && lng !== 37.767726 && lat < 55.449418) {
        //   console.log('empty load from P1 to P2');
        //   // add dynamic empty loads
        //   point.snapshot.data = this.axis.getLoadsFromCurrentWeight(
        //     this.snapshot.emptyLoads
        //   );
        // } else if (lat === 51.6298163 && lng === 39.2576188) {
        //   console.log('UnLoad point reached');
        //   point.snapshot.data = this.axis.getLoadsFromCurrentWeight(
        //     this.snapshot.emptyLoads
        //   );
        //   // } else if (lat < 51.6298163 && lng < 39.2576188 && lat > 55.449418) {
      } else {
        console.log('empty loads');
        // set cargo weight
        // this.cargoWeight = 0;
      }

      if (this.loaded === true) {
        point.snapshot.data = this.axis.getLoadsFromCurrentWeight(
          this.snapshot.notEmptyLoads
        );
      } else {
        point.snapshot.data = this.axis.getLoadsFromCurrentWeight(
          this.snapshot.emptyLoads
        );
      }

      // calculate total weight from current dynamic
      this.totalWeight = Object.values(point.snapshot.data)
        .map(({ weight }) => weight)
        .reduce((acc, cv) => acc + cv);

      this.cargoWeight = this.totalWeight - this.snapshot.vehicleEmptyWeight;

      // calculate current speed
      this.positionInfo.currentSpeed = 0;
      const currentSpeed = this.axis.getCurrentSpeed(
        this.positionInfo.timeStamp,
        this.currentLatLng
      );
      this.positionInfo.currentSpeed = Math.round(currentSpeed);

      // calculate passed distance
      this.metersPassed = this.axis.getDistance(
        this.startPoint,
        this.currentLatLng
      );

      this.positionInfo.passedDistance = Math.floor(this.metersPassed / 1000);
      // console.log('current moment speed: ', currentSpeed);
      // console.log('current AVG speed: ', this.positionInfo.currentSpeed);
      // console.log('meters passed ', this.metersPassed);
      // console.log('km passed ', this.positionInfo.passedDistance);
    });
  }
}
