import { Component, OnInit } from '@angular/core';
import { MapService } from '../services/map.service';
import { TrackList, Snapshot } from '../../shared/track-list.interface';

import { ActivatedRoute } from '@angular/router';
import { CurrentLatLng } from 'src/shared/map.interfaces';
import { SAVED_SNAPSHOTS } from 'src/shared/tracks';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  constructor(private mapService: MapService, private route: ActivatedRoute) {}

  activity: any;
  activityName: string;
  activityComments: string;
  activityDate: Date;
  activityDistance: number;
  gpx: any;

  snapshot: Snapshot;
  currentLatLng: CurrentLatLng;
  totalWeight: number;
  cargoWeight: number;

  ngOnInit() {
    this.activity = this.mapService.getTrack(+this.route.snapshot.params.id);
    this.mapService.plotTrack(+this.route.snapshot.params.id);
    this.activityName = this.activity.name;
    this.activityComments = this.activity.comments;
    this.activityDistance = this.activity.distance;
    this.activityDate = this.activity.date;
    this.gpx = this.activity.gpxData;

    this.mapService.subject.subscribe(value => {
      this.currentLatLng = value;
      const snapshotId = this.route.snapshot.params.id - 1;
      const snapshot = SAVED_SNAPSHOTS[snapshotId];
      snapshot.gps = value;
      this.snapshot = snapshot;
      this.cargoWeight = this.snapshot.cargoWeight;
      this.totalWeight = this.snapshot.totalWeight;

      console.log(this.snapshot);
    });
  }
}
