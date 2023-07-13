/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { ContextMenuDirective } from './context-menu.directive';
import { ElementRef, Renderer2 } from '@angular/core';

describe('Directive: ContextMenu', () => {
  it('should create an instance', () => {
    const elMock = {} as ElementRef<any>;
    const rendererMock = {} as Renderer2;
    const directive = new ContextMenuDirective(elMock, rendererMock);
    expect(directive).toBeTruthy();
  });
});
