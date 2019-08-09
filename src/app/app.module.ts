import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { TrackListComponent } from './track-list/track-list.component';

import { appRoutes } from 'src/routes';
import { MapService } from './services/map.service';
import { TrackService } from './services/track.service';

@NgModule({
  declarations: [AppComponent, MapComponent, TrackListComponent],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [MapService, TrackService],
  bootstrap: [AppComponent]
})
export class AppModule {}
