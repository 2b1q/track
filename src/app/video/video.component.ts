import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';

declare const videojs: any;

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sxm-video',
  templateUrl: './video.component.html'
})
export class VideoJSComponent implements AfterViewInit {
  @ViewChild('video', { static: false }) divVideo: ElementRef;
  private player: any;

  constructor() {
    this.player = false;
  }

  ngAfterViewInit() {
    this.player = videojs(document.getElementById('video'));
    // console.log(this.player);
    this.player.muted(true);
  }
}
