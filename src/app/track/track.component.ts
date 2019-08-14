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
    });
    this.mapService.$pointInfo.subscribe(point => {
      // console.log('new point', point);
      point.snapshot = this.snapshot;
      point.snapshot.data = this.axis.getLoads(
        this.snapshot.cargoWeight,
        this.snapshot.axises
      );
      this.trackLog.points.push(point);
      this.positionInfo = point;
      const [lat, lng] = this.positionInfo.point.geometry.coordinates;
      this.positionInfo.point.geometry.coordinates = [lng, lat];
      // this.currentLatLng = {
      //   lat: this.positionInfo.point.geometry.coordinates[0],
      //   lng: this.positionInfo.point.geometry.coordinates[1]
      // };
    });

    // setInterval(() => console.log('current data', this.positionInfo), 5000);
  }
}
