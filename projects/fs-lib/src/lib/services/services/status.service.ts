import { Injectable } from '@angular/core';
import { fromEvent } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StatusService {

  onlineStatus$ = fromEvent(window, 'online').pipe(
    map(() => true),
    startWith(navigator.onLine)
  );

  constructor() { }
}
