import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor(private _httpClient:HttpClient) { }

  saveMarker(marker: any) {
    this._httpClient
      .post(`http://${window.location.hostname}:5000/saveMarker`, marker, {
        headers: new HttpHeaders({ 'Access-Control-Allow-Origin':'*' }),
      })
      .subscribe((res) => {
        console.log("saveMarker");
      });
  }

  updateMarker(marker: any) {
    this._httpClient
      .post(`http://${window.location.hostname}:5000/updateMarker`, marker, {
        headers: new HttpHeaders({ 'Access-Control-Allow-Origin':'*' }),
      })
      .subscribe((res) => {
        console.log("updateMarker");
      });
  }

  deleteMarker(marker: any) {
    this._httpClient
      .post(`http://${window.location.hostname}:5000/deleteMarker`, marker, {
        headers: new HttpHeaders({ 'Access-Control-Allow-Origin':'*' }),
      })
      .subscribe((res) => {
        console.log("deleteMarker");
      });
  }

  getImages():Observable<string> {
    return this._httpClient.get('assets/images/marker.svg',{responseType: 'text'})
  }
}
