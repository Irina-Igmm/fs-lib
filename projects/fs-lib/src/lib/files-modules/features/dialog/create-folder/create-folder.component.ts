import { AsyncValidatorFn } from '@angular/forms';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

// import { createFolderSchema } from '../../..core/yup-schema/folder.yup';
import { UtilsService } from 'projects/fs-lib/src/lib/services/services/utils.service';

@Component({
  selector: 'app-create-folder',
  templateUrl: './create-folder.component.html',
  styleUrls: ['./create-folder.component.scss']
})
export class CreateFolderComponent implements OnInit {

  createFolderForm!: FormGroup;

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private utilsService: UtilsService
  ) {
    // this.createFolderForm = this.formBuilder.group(
    //   {
    //     label: ['']
    //   },
    //   {
    //     asyncValidators: this.utilsService.validateYupSchema(createFolderSchema)
    //   }
    // );

    this.createFolderForm.controls['label'].valueChanges.subscribe((value) => {
      if(value){
        this.createFolderForm.controls['label'].markAsTouched
      }
    })
  }

  ngOnInit(): void { }

  onCreate(){
    console.log(this.createFolderForm.controls['label'].value);

    if(this.createFolderForm.controls['label'].value){
      this.activeModal.close(this.createFolderForm.controls['label'].value);
    }
  }

  onCancel(){
    this.activeModal.dismiss()
  }

  get labelError(){
    return this.utilsService.getErrorGroupMessageByControl(this.createFolderForm, 'label')
  }
}
