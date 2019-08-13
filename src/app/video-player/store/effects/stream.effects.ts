import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Stream } from '../models/stream';
import * as StreamActions from '../actions/stream.actions';

const streams: Stream[] = [
  // just pretending that we are loading data from an API in this effect.
  {
    title: 'Sintel HD',
    src: 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8'
  },
  {
    title: 'Трансляция с МКС',
    src:
      'http://iphone-streaming.ustream.tv/uhls/17074538/streams/live/iphone/playlist.m3u8'
  }
];

@Injectable()
export class StreamEffects {
  @Effect()
  fetch$: Observable<Action> = this.actions$.pipe(
    ofType(StreamActions.FETCH_STREAMS),
    map(action => ({ type: StreamActions.SET_STREAMS, payload: streams }))
  );

  constructor(private actions$: Actions) {}
}
