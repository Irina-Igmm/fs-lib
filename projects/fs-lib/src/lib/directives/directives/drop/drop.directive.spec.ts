import { UtilsService } from './../../../services/services/utils.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DropDirective } from './drop.directive';
import { ElementRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

describe('DropDirective', () => {
  it('should create an instance', () => {
    const elementRefMock = new ElementRef(null);
    const modalServiceMock = {} as NgbModal;
    const toastrServiceMock = {} as ToastrService;
    const utilsServ = new UtilsService(modalServiceMock, toastrServiceMock)
    const directive = new DropDirective(elementRefMock, utilsServ);
    expect(directive).toBeTruthy();
  });
});
