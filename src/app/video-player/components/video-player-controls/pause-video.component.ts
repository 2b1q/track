import { Component, ViewChild } from '@angular/core';
import { PlayerStatus } from '../../store/models/player';
import * as PlayerActions from '../../store/actions/player.actions';
import { Store } from '@ngrx/store';
import { VideoPlayerState } from '../../store/store.state';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'player-controls-pause',
  template: `
    <button mat-button (click)="pauseVideo()">Pause</button>
  `
})
// tslint:disable-next-line:component-class-suffix
export class PauseVideo {
  constructor(private store: Store<VideoPlayerState>) {}

  pauseVideo() {
    this.store.dispatch(
      new PlayerActions.ChangePlayerStatus(PlayerStatus.PAUSED)
    );
  }
}
