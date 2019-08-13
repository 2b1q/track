import { Component } from '@angular/core';
import * as PlayerActions from '../../store/actions/player.actions';
import { Store } from '@ngrx/store';
import { PlayerStatus } from '../../store/models/player';
import { VideoPlayerState } from '../../store/store.state';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'player-controls-play',
  template: `
    <button mat-button (click)="playVideo()">Play</button>
  `
})
// tslint:disable-next-line:component-class-suffix
export class PlayVideo {
  constructor(private store: Store<VideoPlayerState>) {}

  playVideo() {
    this.store.dispatch(
      new PlayerActions.ChangePlayerStatus(PlayerStatus.PLAYING)
    );
  }
}
