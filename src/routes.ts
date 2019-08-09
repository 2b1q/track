import { Routes } from '@angular/router';
import { TrackListComponent } from './app/track-list/track-list.component';
import { MapComponent } from './app/map/map.component';

export const appRoutes: Routes = [
  { path: 'tracks', component: TrackListComponent },
  { path: 'track/:id', component: MapComponent },
  { path: '', redirectTo: 'tracks', pathMatch: 'full' }
];
