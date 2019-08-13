import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Stream } from '../../store/models/stream';
import { VideoPlayerState } from '../../store/store.state';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements OnInit {
  state$: Observable<any>;
  stream: Stream;

  constructor(private store: Store<VideoPlayerState>) {}

  ngOnInit() {
    this.state$ = this.store.select('videoPlayer');
    this.state$.subscribe((val: any) => {
      this.stream = val.selectedStream;
    });
  }
}
