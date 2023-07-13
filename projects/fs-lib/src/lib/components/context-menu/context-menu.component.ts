import { ContentChild, EventEmitter, Output, TemplateRef } from '@angular/core';
import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss']
})
export class ContextMenuComponent implements OnInit, OnDestroy,  AfterViewInit {

  @Input() contextId!: string;

  @Input() contextData: any;

  @Output() contextDataChange = new EventEmitter<any>()

  @ContentChild(TemplateRef) myTemplate!: TemplateRef<any>;


  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit(){
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-ng-context-data') {
          const attributeValue = (mutation.target as Element).getAttribute('data-ng-context-data');

          this.contextDataChange.emit(JSON.parse(attributeValue as string))
        }
      });
    });

     observer.observe(this.elementRef.nativeElement.querySelector( `#${this.contextId}`), {
      attributes: true,
    });

  }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    // this.contextDataSubject.complete();
  }
}
