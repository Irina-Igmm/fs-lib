import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragNDropDirective } from './directives/drag-n-drop.directive';



@NgModule({
  declarations: [
    DragNDropDirective,
  ],
  imports: [
    CommonModule
  ],
  exports :[
    DragNDropDirective

  ]
})
export class DirectivesModule { }
