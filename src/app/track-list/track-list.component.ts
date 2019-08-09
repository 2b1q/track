import { Component, OnInit } from '@angular/core';
import { TrackList } from '../../shared/track-list.interface';
import { TrackService } from '../services/track.service';

@Component({
  selector: 'app-track-list',
  templateUrl: './track-list.component.html',
  styleUrls: ['./track-list.component.css']
})
export class TrackListComponent implements OnInit {
  tracks: TrackList[];
  totalTracks: number;
  totalDistance: number;
  // firstDate: Date;

  constructor(private trackService: TrackService) {}

  ngOnInit() {
    this.tracks = this.trackService.getTracks();
    this.totalTracks = this.trackService.getTotalTracks(this.tracks);
    this.totalDistance = this.trackService.getTotalDistance(this.tracks);
    // this.firstDate = this.trackService.getFirstDate(this.tracks);
  }
}
