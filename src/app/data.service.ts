import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { Subject, BehaviorSubject, Subscription } from 'rxjs';
import { BackendCommunicationService } from './backend-communication.service';
import { takeWhile } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService implements OnDestroy {
  alive = true;
  data$ = new BehaviorSubject(null);
  currentData: any;

  constructor() {
   }

  initialize(initData) {
    this.data$.next(initData);
    this.data$.pipe(takeWhile(x => this.alive)).subscribe((data: any) => this.currentData = data);
   }

  ngOnDestroy(): void {
    this.alive = false;
  }

  updateData(deltas: any) {
    for (const delta in deltas) {
      if (deltas.hasOwnProperty(delta)) {
        const splitPath = delta.split('.');
        let tempStateSegment = this.currentData;
        let finalPathVar = ``;
        for (const pathVar of splitPath) {                // walk through the path given
          if (splitPath[splitPath.length - 1] === pathVar) {
            finalPathVar = pathVar;
            continue;
          }
          tempStateSegment = tempStateSegment[pathVar];
        }
        const updatedValue = (Array.isArray(tempStateSegment[finalPathVar])) ? [deltas[delta]] : deltas[delta];
        tempStateSegment[finalPathVar] = updatedValue;     // set the value in this local variable to what it is based on the deltas.value
        this.data$.next(this.currentData);
      }
    }
    // determine if we have externalFilters that need updating...





  }
}
