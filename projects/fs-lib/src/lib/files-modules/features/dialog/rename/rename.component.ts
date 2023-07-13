import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { UtilsService } from 'projects/fs-lib/src/lib/services/services/utils.service';

// import { storageRenameSchema } from '../../../core/yup-schema/storage.yup';
import { I_File, I_Folder } from '../../../../interfaces/interfaces/file.model';

@Component({
  selector: 'app-rename',
  templateUrl: './rename.component.html',
  styleUrls: ['./rename.component.scss']
})
export class RenameComponent implements OnInit {
  renameForm!: FormGroup;

  @Input() file!: I_File;

  @Input() folder!: I_Folder;

  @Input() type!: 'folder' | 'file';

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private utilsService: UtilsService
  ) { }

  ngOnInit(): void {
    // this.renameForm = this.formBuilder.group(
    //   {
    //     label: [this.type == 'file' ? this.file.name : this.folder.name]
    //   },
    //   {
    //     asyncValidators: this.utilsService.validateYupSchema(storageRenameSchema)
    //   }
    // );

    this.renameForm.controls['label'].valueChanges.subscribe((value) => {
      if(value){
        this.renameForm.controls['label'].markAsTouched
      }
    });
  }

  onRename(){
    console.log(this.renameForm.controls['label'].value);

    if(this.renameForm.controls['label'].value){
      this.activeModal.close(this.renameForm.controls['label'].value);
    }
  }

  onCancel(){
    this.activeModal.dismiss()
  }

  get labelError(){
    return this.utilsService.getErrorGroupMessageByControl(this.renameForm, 'label')
  }
}
