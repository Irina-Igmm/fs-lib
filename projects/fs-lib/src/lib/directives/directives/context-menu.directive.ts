import { Renderer2 } from '@angular/core';
import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';

@Directive({
  selector: '[ngContextMenu]',
  exportAs: 'contextMenu'
})
export class ContextMenuDirective  {
  @Input('ngContextMenu') menuId!: string;

  @Input() ngContextData!: any;

  @Output() ngContextMenuShow = new EventEmitter<MouseEvent>();

  @Output() ngContextMenuClose = new EventEmitter<void>();

  private menu!: HTMLElement | null;

  public testData!: any;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit() {}

  @HostListener('mousedown', ['$event'])
  onContextMenu(event: MouseEvent) {

    if (event.button === 2) {
      const find = this.getClickedElements(event);

      const findOmitClass = find.find((f) =>
        f.className.split(' ').includes('omit-' + this.menuId)
      );

      if (!findOmitClass) {
        event.preventDefault();
        event.stopPropagation();

        const x = event.clientX;
        const y = event.clientY;

        this.showMenu(x, y);

        this.ngContextMenuShow.emit(event);
      }
    }
  }

  private getClickedElements(event: MouseEvent): HTMLElement[] {
    const clickedElements: HTMLElement[] = [];

    let currentElement: any = event.target as HTMLElement;

    while (currentElement) {
      clickedElements.push(currentElement);

      if (currentElement === document.documentElement) {
        break;
      }

      currentElement = currentElement.parentElement;
    }

    return clickedElements;
  }

  @HostListener('document:click')
  onDocumentClick() {
    this.hideMenu();
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.hideMenu();
  }

  @HostListener('document:contextmenu', ['$event'])
  onDocumentContextMenu(event: MouseEvent) {
    event.preventDefault();
  }

  private showMenu(x: number, y: number) {
    const menuElements = document.querySelectorAll('[ngContextMenu]');

    menuElements.forEach((element) => {
      const menuId = element.getAttribute('ngContextMenu');
      if (menuId) {
        const instancedMeny = document.getElementById(menuId);

        if (instancedMeny) {
          instancedMeny.style.display = 'none';
        }
      }
    });

    this.menu = document.getElementById(this.menuId);

    if (this.menu) {
      this.menu.style.display = 'block';
      this.menu.style.left = `${x}px`;
      this.menu.style.top = `${y}px`;

      const menuRect = this.menu.getBoundingClientRect();
      const menuWidth = menuRect.width;
      const menuHeight = menuRect.height;

      const bodyRect = document.body.getBoundingClientRect();
      const bodyWidth = bodyRect.width;
      const bodyHeight = bodyRect.height;

      // console.log()

      if (x + menuWidth > bodyWidth) {
        this.menu.style.left = `${x - menuWidth}px`;
      }

      if (y + menuHeight > bodyHeight) {
        this.menu.style.top = `${y - menuHeight}px`;
      }

      const myId = document.getElementById(this.menuId);

      // console.log(this.ngContextData)

      this.renderer.setAttribute(myId, 'data-ng-context-data', JSON.stringify(this.ngContextData));

    }
  }

  private hideMenu() {
    const menu = document.getElementById(this.menuId);
    if (menu) {
      menu.style.display = 'none';
      this.ngContextMenuClose.emit();
    }
  }
}
