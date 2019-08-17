import { Routes } from '@angular/router';
import { TrackListComponent } from './app/track-list/track-list.component';
import { MapComponent } from './app/map/map.component';
import { TrackComponent } from './app/track/track.component';

export const appRoutes: Routes = [
  // { path: 'tracks', component: TrackListComponent },
  // { path: 'track/:id', component: MapComponent },
  { path: 'current/:id', component: TrackComponent },
  { path: '', redirectTo: 'current/2', pathMatch: 'full' }
];
