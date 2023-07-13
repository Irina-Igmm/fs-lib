import { Directive, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
  selector: '[onDoubleClick]'
})
export class DoubleClickDirective {
  @Output() onDoubleClick = new EventEmitter();

  @HostListener('dblclick') detectDoubleClick() {
    this.onDoubleClick.emit();
  }
}
