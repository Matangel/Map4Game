import { Injectable, OnInit } from '@angular/core';
import { Subject, } from 'rxjs';
import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import Marker from '../types/marker.type';

@Injectable({
  providedIn: 'root',
})
export class WsService {

  constructor() {
  }

  start(): Subject<Marker[]> {
    const wsc: WebSocketSubject<any> = webSocket<any>({
      url: `ws://${window.location.hostname}:3000`,
      protocol: 'ws',
    });
    const markers = new Subject<Marker[]>();
    wsc.subscribe({
      next: (data) => {
        markers.next(data);
      },
      error: (err) => console.log(err),
      complete: () => console.log("disconnected"),
    });
    return markers;
  }
}
