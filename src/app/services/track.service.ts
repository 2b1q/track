import { Injectable } from '@angular/core';
import { TrackList } from '../../shared/track-list.interface';
import { SAVED_ACTIVITIES } from 'src/shared/tracks';

@Injectable()
export class TrackService {
  constructor() {}

  getTracks(): TrackList[] {
    return SAVED_ACTIVITIES.slice(0);
  }

  getTotalTracks(allActivities: TrackList[]) {
    return allActivities.length;
  }

  getTotalDistance(allActivities: TrackList[]) {
    let totalDistance = 0;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < allActivities.length; i++) {
      totalDistance += allActivities[i].distance;
    }
    return totalDistance;
  }
}
