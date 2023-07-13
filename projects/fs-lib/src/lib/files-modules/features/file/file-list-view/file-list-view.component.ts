import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';

import { I_File } from 'projects/fs-lib/src/lib/interfaces/interfaces/file.model';

import { FileService } from 'projects/fs-lib/src/lib/services/core/services/file.service';
import { T_Storage } from '../../../../interfaces/interfaces';

@Component({
  selector: 'app-file-list-view',
  templateUrl: './file-list-view.component.html',
  styleUrls: ['./file-list-view.component.scss'],
})
export class FileListViewComponent implements OnInit {
  private isLoading: boolean = false;

  @Input() files: I_File[] = [];

  @Input() drop: any;

  @Output() fetchMore = new EventEmitter();

  constructor(private fileService: FileService) {}

  ngOnInit(): void {}

  paginate(e: any) {
    if (this.isAllFilesListLoaded && !this.isLoaded) {
      this.fileService.isFilesLoading = true;
      return this.fetchMore.emit();
    }
  }

  public get isAllFilesListLoaded() {
    return (
      this.fileService.filesPagination$.value.page ==
      (this.fileService.filesPagination$.value.totalPages as number)
    );
  }


  get isLoaded() {
    // return this.isLoading;
    return this.fileService.isFilesLoading;
  }

  get checkedFileList() {
    return this.fileService.multiCheck['file'].subCheck as any;
  }

  checkChange(value: MatCheckboxChange | any, fileId: number) {
    this.fileService.multiCheckChange(value, fileId, 'file');
  }

  get allComplete() {
    return this.fileService.multiCheck['file'].completed;
  }

  someComplete(): boolean {
    return this.fileService.completeCheckSome('file');
  }

  setAll(completed: MatCheckboxChange | any) {

    this.fileService.setCheckAll(completed.checked, 'file');

  }

  onMouseDown(index: number, storageType: T_Storage) {

    this.fileService.mouseDownOnFolder(index, storageType);

  }
}
