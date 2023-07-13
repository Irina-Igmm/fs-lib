import { Component, Input, OnInit } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent implements OnInit {

  @Input() title!: string;

  @Input() message!: string;

  constructor(public activeModal: NgbActiveModal,) { }

  ngOnInit(): void {  }

  onOk(){
    this.activeModal.close(true);
  }

  onCancel(){
    this.activeModal.close(false);
  }
}
