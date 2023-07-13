import { Component, Inject, Input, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-user-selector-dialog',
  templateUrl: './user-selector-dialog.component.html',
  styleUrls: ['./user-selector-dialog.component.scss']
})

export class UserSelectorDialogComponent implements OnInit {

  constructor(
      public dialog: MatDialog,
      private modalService: NgbModal
  ) {}

  ngOnInit(): void {
  }


	open() {
		const modalRef = this.modalService.open(
      UserSelectorWindow, 
      { centered: true,
        windowClass: '',
      },
    );
    
		modalRef.componentInstance.name = 'World';

    modalRef.closed.subscribe((result)=> {
      console.log('result', result);
    });

    modalRef.dismissed.subscribe((result)=> {
      console.log('dismiss result', result);
    });

	}

}

@Component({
  selector: 'user-selector-window',
  templateUrl: './user-selector-dialog-window.html',
})
export class UserSelectorWindow {
	@Input() name:string =  '';

	constructor(public activeModal: NgbActiveModal) {}
}
