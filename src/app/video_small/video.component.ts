import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';

declare const videojs_sm: any;

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sxm-videosm',
  templateUrl: './video.component.html'
})
export class SmallVideoJSComponent implements AfterViewInit {
  @ViewChild('video', { static: false }) divVideo: ElementRef;
  private player: any;

  constructor() {
    this.player = false;
  }

  ngAfterViewInit() {
    this.player = videojs_sm(document.getElementById('videosm'));
    // console.log(this.player);
    this.player.muted(true);
  }
}
