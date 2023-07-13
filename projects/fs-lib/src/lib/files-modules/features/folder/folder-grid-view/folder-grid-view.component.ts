import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';

import { I_Folder } from 'projects/fs-lib/src/lib/interfaces/interfaces/file.model';

import { FileService } from '../../../../services/core/services/file.service';
import { T_Storage } from '../../../../interfaces/interfaces';

@Component({
  selector: 'app-folder-grid-view',
  templateUrl: './folder-grid-view.component.html',
  styleUrls: ['./folder-grid-view.component.scss'],
})
export class FolderGridViewComponent implements OnInit {

  @Input() folders: I_Folder[] = [];

  @Input() drop: any;

  @Output() fetchMore = new EventEmitter();

  @Output() dblClick = new EventEmitter();

  constructor(private fileService: FileService) {}

  ngOnInit(): void {}

  paginate(e: any) {
    if (this.isAllFoldersListLoaded && !this.isLoaded) {
      this.fileService.isFoldersLoading = true;

      return this.fetchMore.emit();
    }

  }

  get isAllFoldersListLoaded() {
    return (
      this.fileService.foldersPagination$.value.page ==
      (this.fileService.foldersPagination$.value.totalPages as number)
    );
  }

  get isLoaded() {

    return this.fileService.isFoldersLoading;

  }

  get newFolder() {
    return this.fileService.newFolder.value;
  }

  get checkedFolderList() {
    return this.fileService.multiCheck['folder'].subCheck as any;
  }

  checkChange(value: MatCheckboxChange | any , folderId: number) {
    this.fileService.multiCheckChange(value, folderId, 'folder');
  }

  get allComplete() {
    return this.fileService.multiCheck['folder'].completed;
  }

  someComplete(): boolean {
    return this.fileService.completeCheckSome('folder');
  }
  
  setAll(completed: MatCheckboxChange | any) {

    this.fileService.setCheckAll(completed.checked, 'folder');

  }

    onDblCLick(folder: I_Folder){
    this.dblClick.emit(folder)
  }


  onMouseDown(index: number, storageType: T_Storage) {

    this.fileService.mouseDownOnFolder(index, storageType);

  }
}
