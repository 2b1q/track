import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { AppToolbarComponent } from './app-toolbar.component';

import { MapComponent } from './map/map.component';
import { TrackListComponent } from './track-list/track-list.component';
import { TrackComponent } from './track/track.component';
import { appRoutes } from 'src/routes';

import { MapService } from './services/map.service';
import { TrackService } from './services/track.service';
import { AxisService } from 'src/shared/axis.service';

import { NgMaterialModule } from './ng-material/ng-material.module';
import { VideoPlayerModule } from './video-player/video-player.module';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    TrackListComponent,
    TrackComponent,
    AppToolbarComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgMaterialModule,
    VideoPlayerModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({
      maxAge: 10
    }),
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [MapService, TrackService, AxisService],
  bootstrap: [AppComponent]
})
export class AppModule {}
