import { Component, Input, OnInit, Self } from '@angular/core';
import * as L from 'leaflet';
import { ButtonModule } from 'primeng/button';
import { SidebarComponent } from '../component/sidebar/sidebar.component';
import { NgIf } from '@angular/common';
import Marker from '../types/marker.type';
import { MapService } from '../services/map.service';
import { WsService } from '../services/ws.service';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [ButtonModule, SidebarComponent, NgIf],
  templateUrl: './map.page.html',
  styleUrl: './map.page.scss',
  providers: [MapService, WsService],
})
export class MapPage implements OnInit {
  grid: L.LayerGroup<any> = L.layerGroup();
  constructor(private mapService: MapService, private wsService: WsService) {}
  showSidebar = false;
  isEdit = false;

  map!: L.Map;
  layers: L.LayerGroup = L.layerGroup();
  curentMarkerData: Marker = {
    _id: '',
    title: '',
    description: '',
    color: '#ff0000',
    position: L.latLng(0, 0),
  };
  currentMarker?: L.Marker;

  ngOnInit() {
    this.initMap();

    this.wsService.start().subscribe((markers) => {
      this.layers.clearLayers();
      markers.forEach((marker) => {
        this.createMarker(marker).subscribe((res) => {
          res.on('contextmenu', () => {
            this.curentMarkerData = {
              _id: marker._id,
              title: marker.title,
              description: marker.description,
              color: marker.color,
              position: marker.position,
            };
            this.showSidebar = true;
            this.isEdit = true;
          });
          res.addTo(this.layers);
        });
      });
    });
  }

  initMap(pos?: L.LatLng): void {
    if (!pos) {
      pos = L.latLng(0.8740412577319571, -0.784149169921875);
    }

    this.map = L.map('map', {
      center: pos,
      zoom: 13,
    });

    L.tileLayer('http://localhost:5000/tiles/{z}/{x}/{y}.jpg', {
      attribution: '♥ Shiryu ♥',
      maxZoom: 15,
      minZoom: 10,
      maxNativeZoom: 14,
      minNativeZoom: 13,
    }).addTo(this.map);

    this.map.on('click', (e) => {
      if (this.showSidebar) {
        this.curentMarkerData.position = e.latlng;
        if (this.currentMarker) {
          this.currentMarker?.remove();
        }
        this.createMarker(this.curentMarkerData).subscribe((res) => {
          this.currentMarker = res;
          res.addTo(this.map);
        });
      }
    });

    this.map.on('contextmenu', (e) => {});
    L.polyline(
      [
        [1.0546279422758869, -1.0546875000000002],
        [0.39550467153201946, -0.39550467153201946],
      ],
      { color: '#ff0000' }
    ).addTo(this.grid);

    //decouper un interval en n parties egales
    // longeur de l'intervalle = (sup - inf)/n

    this.grid.addTo(this.map);

    this.layers.addTo(this.map);
  }

  intToChar(i: number):string {
    return String.fromCharCode('A'.charCodeAt(0) + Math.round(i));
  }

  createMarker(_marker: Marker): Observable<L.Marker> {
    return this.mapService.getImages().pipe(
      map((markerText) => {
        markerText = markerText.replace('%COLOR%', _marker.color);
        const icon = new L.DivIcon({
          html: markerText,
          iconSize: [24, 40],
          iconAnchor: [12, 40],
          tooltipAnchor: [0, -40],
        });
        const marker = L.marker(_marker.position, { icon: icon })
        if (_marker.title){
          const tooltip = `<b>${_marker.title}</b><br>${_marker.description}`;
          marker.bindTooltip(tooltip, {
            direction: 'top',
            offset: L.point(0, -40),
          });
        }
        return marker;
      })
    );
  }

  handleAction(action: { action: string; marker: Marker }) {
    switch (action.action) {
      case 'save':
        this.saveMarker(action.marker);
        break;
      case 'cancel':
        this.hideSidebar();
        break;
      case 'update':
        this.updateMarker(action.marker);
        break;
      case 'delete':
        this.deleteMarker(action.marker);
        break;
    }
  }

  hideSidebar() {
    this.curentMarkerData = {
      _id: '',
      title: '',
      description: '',
      color: '#ff0000',
      position: L.latLng(0, 0),
    };
    this.showSidebar = false;
    this.isEdit = false;
    if (this.currentMarker) {
      this.currentMarker.remove();
      this.currentMarker = undefined;
    }
  }

  saveMarker(marker: Marker) {
    if (marker) {
      this.mapService.saveMarker(marker);
      this.hideSidebar();
    }
  }

  updateMarker(marker: Marker) {
    if (marker) {
      this.mapService.updateMarker(marker);
      this.hideSidebar();
    }
  }

  deleteMarker(marker: Marker) {
    if (marker) {
      this.mapService.deleteMarker(marker);
      this.hideSidebar();
    }
  }

  toggleSidebar() {
    this.isEdit = false;
    if (this.showSidebar) {
      this.hideSidebar();
    } else {
      this.showSidebar = true;
    }
  }
}
