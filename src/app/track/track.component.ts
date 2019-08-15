import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MapService } from '../services/map.service';
import {
  TrackLog,
  Snapshot,
  CurrentLatLng,
  SnapshotData,
  PositionInfo
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
  data: SnapshotData[];
  positionInfo: PositionInfo;

  constructor(
    private route: ActivatedRoute,
    private mapService: MapService,
    private axis: AxisService
  ) {}

  ngOnInit() {
    const { id: trackId } = this.route.snapshot.params;
    this.activity = this.mapService.getCurrentTrack(trackId);
    this.mapService.plotCurrentTrack(trackId);
    this.gpx = this.activity.gpxData;

    console.log(`display current activity ID ${trackId}`, this.activity);

    // update real time track info
    this.mapService.$trackLog.subscribe(track => {
      console.log('create track', track);
      this.trackLog = track;
      this.snapshot = SAVED_SNAPSHOTS[3];
      const [
        startLng,
        startLat
      ] = this.trackLog.startPoint.geometry.coordinates;
      this.startPoint = {
        lat: startLat,
        lng: startLng
      };
    });
    this.mapService.$pointInfo.subscribe(point => {
      // update dynamic point info
      point.snapshot = this.snapshot;
      point.snapshot.data = this.axis.getLoads(
        this.snapshot.cargoWeight,
        this.snapshot.axises
      );
      this.trackLog.points.push(point);
      this.positionInfo = point;
      const [lat, lng] = this.positionInfo.point.geometry.coordinates;
      this.positionInfo.point.geometry.coordinates = [lng, lat];

      // revert lat <> lng \0/
      this.currentLatLng = {
        lat: lng,
        lng: lat
      };

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
      console.log('current moment speed: ', currentSpeed);
      console.log('current AVG speed: ', this.positionInfo.currentSpeed);
      console.log('meters passed ', this.metersPassed);
      console.log('km passed ', this.positionInfo.passedDistance);
    });
  }
}
