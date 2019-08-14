import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';

import { MapComponent } from './map/map.component';
import { TrackListComponent } from './track-list/track-list.component';
import { TrackComponent } from './track/track.component';
import { appRoutes } from 'src/routes';

import { MapService } from './services/map.service';
import { TrackService } from './services/track.service';
import { AxisService } from 'src/shared/axis.service';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    TrackListComponent,
    TrackComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [MapService, TrackService, AxisService],
  bootstrap: [AppComponent]
})
export class AppModule {}
