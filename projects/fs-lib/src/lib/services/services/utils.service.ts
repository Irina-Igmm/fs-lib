import { Injectable } from '@angular/core';
import {  AsyncValidatorFn, FormGroup } from "@angular/forms";

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import  * as yup from 'yup';

import { I_APIRes } from '../../interfaces/interfaces/api.model';
import { ConfirmationDialogComponent } from '../../components/confirmation-dialog/confirmation-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { I_File } from '../../interfaces/interfaces/file.model';
import { I_FolderTree } from '../../interfaces/interfaces/api.model';
@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(
    private modalService: NgbModal,
    private toastrService: ToastrService
  ) { }

  reqDataToObservable<T>(data: T | Observable<I_APIRes>) {
    if (data instanceof Observable) {
      return data.pipe(map((d) => d.data.content)) as Observable<T>;
    } else {
      return of(data);
    }
  }

  validateYupSchema<T>(yupSchema: yup.ISchema<T> | any): AsyncValidatorFn {
    return (control: any) =>
      new Promise(resolve => {
        yupSchema
          .validate(control.value, { abortEarly: false })
          .then(function (value: any) {
            // Success
          })
          .catch(function (err: any) {
            const errors = Object.values(
              (err.inner as any[])
                .map((e: any) => {
                  const result = { message: e.message, path: e.path };

                  if (e.path == '') {
                    return control.touched ? e.message : undefined;
                  }

                  console.log(control.get(e.path))

                  return result;
                })
                .filter(maped => maped != undefined)
            );

            resolve(errors);
          });
      });
  }

  getErrorGroupMessageByControl(formGroup: FormGroup, path: string) {
    const message = Object.values(formGroup.errors || {}).filter(
      (controlErrors: any) => {
        return controlErrors?.path == path
      }
    )[0]?.message;

    const touchedControl = formGroup.controls[path].touched

    return touchedControl ?  message : undefined;
  }

  confirmationDialog(title: string, message: string, onOk: (value: boolean)=> void){
    const dialogRef = this.modalService.open(ConfirmationDialogComponent, {
      centered: true,
      windowClass: 'modal-global-class',
    });

    dialogRef.componentInstance['title'] = title;

    dialogRef.componentInstance['message'] = message;

    dialogRef.closed.subscribe((value) => {
      if(value){
        onOk(value);
      }
    });
  }


  showInfoMessage(title: string, message: string): void {

    this.toastrService.show(message, title);

  }


  showSuccessMessage(title: string, message: string): void {

      this.toastrService.success(message, title);

  }


  showErrorMessage(title: string, message: string): void {

      this.toastrService.error(message, title);

  }


  showWarningMessage(title: string, message: string): void {

      this.toastrService.warning(message, title);

  }


  setFileTree(files: FileList) {

    let fileTree: I_File[] = [];

    for (let i = 0; i < files.length; i++) {
      // const file = files[i];

      const file = files[i] as File & {webkitRelativePath?: string};
      const path = file.webkitRelativePath || file.name; // get the path of the file
      const pathSegments = path.split('/'); // split the path into segments

      let current: {[key: string]: any } = fileTree;
      for (let j = 0; j < pathSegments.length; j++) {
        const segment: string = pathSegments[j];
        if (!current[segment]) {
          current[segment] = j === pathSegments.length - 1 ? file : {};
        }
        current = current[segment];
      }
    }

    return fileTree;

  }


  public buildFileTree(files: FileList) {
    const fileTree: I_FolderTree  = { name: "root", type: "folder", children: [] };

    const rootFile = (files[0] as File & {webkitRelativePath?: string});

    const rootPath = (rootFile.webkitRelativePath || rootFile.name).split("/")[0];

    fileTree.name = rootPath;

    let allFiles: any[] = [];

    for (let i = 0; i < (files.length); i++) {

      const file = files[i] as File & {webkitRelativePath?: string};
      const path = file.webkitRelativePath || file.name;
      const pathSegments = path.split("/");

      let current = fileTree;

      for (let j = 0; j < pathSegments.length; j++) {
        const segment = pathSegments[j];
        let existingPath = current.children.find((child) => child.name === segment);
        if (!existingPath) {
          const newFolder: I_FolderTree = { name: segment, type: j === pathSegments.length - 1 ? "file" : "folder", children: [] as I_FolderTree[] };
          current.children.unshift(newFolder);
          existingPath = newFolder;
        }
        if (j === pathSegments.length - 1 && existingPath.type === "file") {
          existingPath.data = file;
        }
        existingPath.count = existingPath.count ? existingPath.count + 1 : 1;
        current = existingPath;
      }
    }

    // console.log('UPLOAD BUTTON FILE TREE', fileTree.children)

    return fileTree.children;
    // return fileTree;
  }


  public buildFileTrees(files: FileList) {
    const fileTree: I_FolderTree  = { name: "root", type: "folder", children: [] };

    const rootFile = (files[0] as File & {webkitRelativePath?: string});

    const rootPath = (rootFile.webkitRelativePath || rootFile.name).split("/")[0];

    fileTree.name = rootPath;

    let allFiles: any[] = [];

    let newFolderContent: any[] = [];

    for (let i = 0; i < (files.length); i++) {

      const file = files[i] as File & {webkitRelativePath?: string};
      const path = file.webkitRelativePath || file.name;
      const pathSegments = path.split("/");

      let current = fileTree;

      for (let j = 0; j < pathSegments.length; j++) {
        const segment = pathSegments[j];
        let existingPath = current.children.find((child) => child.name === segment);
        if (!existingPath) {
          const newFolder: I_FolderTree = { name: segment, type: j === pathSegments.length - 1 ? "file" : "folder", children: [] as I_FolderTree[] };
          current.children.unshift(newFolder);
          existingPath = newFolder;
        }
        if (j === pathSegments.length - 1 && existingPath.type === "file") {
          existingPath.data = file;
          allFiles.unshift(file)
        }
        existingPath.count = existingPath.count ? existingPath.count + 1 : 1;
        current = existingPath;
      }
    }

    console.log('UPLOAD BUTTON FILE TREE', fileTree.children, allFiles)

    return fileTree.children;
    // return fileTree;
  }


  downloadFileFromBase64(file: string, fileName: string) {
    const linkSource = 'data:application/octet-stream;base64,' + file;
    const downloadLink = document.createElement('a');

    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }

}
