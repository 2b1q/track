import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MapService } from '../services/map.service';

@Component({
  selector: 'app-track',
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.css']
})
export class TrackComponent implements OnInit {
  activity: any;
  gpx: any;

  constructor(private route: ActivatedRoute, private mapService: MapService) {}

  ngOnInit() {
    const { id: trackId } = this.route.snapshot.params;
    this.activity = this.mapService.getCurrentTrack(trackId);
    this.mapService.plotCurrentTrack(trackId);
    this.gpx = this.activity.gpxData;

    console.log(`display current activity ID ${trackId}`, this.activity);
  }
}
