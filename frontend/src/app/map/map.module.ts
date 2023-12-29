import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapRoutingModule } from './map-routing.module';
import { SidebarComponent } from './component/sidebar/sidebar.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule, MapRoutingModule, SidebarComponent
  ],
  exports: [MapRoutingModule]
})
export class MapModule { }
