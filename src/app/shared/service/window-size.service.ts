import { Injectable, OnDestroy } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { BehaviorSubject, fromEvent, Observable, Subscription } from 'rxjs';
import { filter, map, tap, throttleTime } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WindowSizeService implements OnDestroy
 {
  private XSMALL_WINDOW_SIZE = 'xs';
  private SMALL_WINDOW_SIZE = 'sm';

  private mediaSubscription: Subscription;
  
  isWindowSmall: boolean;

  constructor(public mediaObserver: MediaObserver) 
  {
    this.mediaSubscription = this.mediaObserver.asObservable().pipe(
      filter(mediaChanges => mediaChanges.length > 0), // If there is media change
      map(mediaChanges => mediaChanges[0]) // Take the first one (transform)
    )
    .subscribe((mediaSize: MediaChange) => { // Subscribe to that media change
      this.isWindowSmall = // Set small window indicator according to media size
        mediaSize.mqAlias === this.XSMALL_WINDOW_SIZE || 
        mediaSize.mqAlias === this.SMALL_WINDOW_SIZE ? true : false;
    })
  }

  ngOnDestroy(): void {
    this.mediaSubscription.unsubscribe();
  }
  
}
