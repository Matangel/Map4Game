import { Component, EventEmitter, Input, Output } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ButtonModule } from 'primeng/button';
import Marker from '../../types/marker.type';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    InputTextModule,
    InputTextareaModule,
    ColorPickerModule,
    ButtonModule,
    FormsModule,
    NgIf,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  @Input() currentMarker!: Marker;
  @Input() isEdit!: boolean;
  @Output() action: EventEmitter<action> = new EventEmitter();

  constructor() {}

  cancel() {
    this.action.emit({action:"cancel", marker: this.currentMarker});
  }

  save() {
    if(this.currentMarker.title !== '') {
    this.action.emit({action:"save", marker: this.currentMarker});
    }
  }

  update() {
    this.action.emit({action:"update", marker: this.currentMarker});
  }

  delete() {
    this.action.emit({action:"delete", marker: this.currentMarker});
  }

}
  type action = {
    action: string;
    marker: Marker;
  }

