import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { I_File, I_Folder } from '../../../interfaces/interfaces/file.model';
import { FileService } from '../../../services/core/services/file.service';
import { ApiService } from '../../../services/services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilsService } from '../../../services/services/utils.service';
import { ActivatedRoute } from '@angular/router';
import { CopyService } from '../../../services/core/services/copy.service';
import { I_StorageFilter } from '../../../interfaces/interfaces/storage-filter';
import { RenameComponent } from '../../features/dialog/rename/rename.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-my-shared-list-page',
  templateUrl: './my-shared-list-page.component.html',
  styleUrls: ['./my-shared-list-page.component.scss']
})
export class MySharedListPageComponent implements OnInit {

  isFullListDisplayed: boolean = false;

  public subscription: Subscription = new Subscription();

  listView: boolean = true;

  folderContextData: I_Folder | any = null;

  fileContextData: I_Folder | any = null;

  constructor(
    private fileService: FileService,
    private apiService: ApiService,
    private modalService: NgbModal,
    private utilsService: UtilsService,
    private activatedRoute: ActivatedRoute,
    private copyService: CopyService
  ) {
    this.fileService.userDisplayMode$.subscribe((data) => {
      console.log('view ', data);
      this.listView = data == 'list' ? true : false;
    });
  }

  ngOnInit(): void {
  }


  get filesList() {
    return this.fileService.filesList;
  }

  get foldersList() {
    return this.fileService.folderList;
  }


  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(
      this.filesList.value,
      event.previousIndex,
      event.currentIndex
    );
  }

  onScroll(event: any): void {
    // console.log('scrolled', event);
    this.fileService.page$.next(this.fileService.page$.value + 1);

    this.fileService.fileFilter$.next({
      ...this.fileService.fileFilter$.value,
      page: this.fileService.page$.value + 1,
      limit: this.fileService.limit$.value,
    });
  }


  onFetchFolderMore() {
    this.fileService.foldersFilter$.next({
      ...(this.fileService.foldersFilter$.value as I_StorageFilter),
      archived: true,
      pagination: {
        limit: this.fileService.foldersPagination$.value.limit as number,
        page: (this.fileService.foldersPagination$.value.page as number) + 1,
      } as I_StorageFilter['pagination'],
    });
  }

  onFetchFileMore() {
    this.fileService.filesFilter$.next({
      ...(this.fileService.filesFilter$.value as I_StorageFilter),
      archived: true,
      pagination: {
        limit: this.fileService.filesPagination$.value.limit as number,
        page: (this.fileService.filesPagination$.value.page as number) + 1,
      } as I_StorageFilter['pagination'],
    });
  }


  onDelete() {
    if (!this.isMultiActionDisable) {
      let message = 'Vous allez supprimer ces elements.';

      this.utilsService.confirmationDialog(
        'Suppression multiple',
        message,
        (confirm) => {
          if (confirm) {
            const checkedFiles =
              this.fileService.multiCheck.file.subCheck.filter(
                (f: any) => f.completed == true
              ) || [];

            const checkedFolder =
              this.fileService.multiCheck.folder.subCheck.filter(
                (f: any) => f.completed == true
              ) || [];

            const checkConcate = checkedFiles.concat(checkedFolder);

            this.fileService.deleteStorageElements(
              checkConcate.map((f: any) => f.id)
            );
          }
        }
      );
    }
  }

  onDeleteSingle(
    storageElement: I_Folder | I_File | null,
    type: 'folder' | 'file'
  ) {
    let message = `Vous allez supprimer ce ${
      type == 'folder' ? 'dossier' : 'fichier'
    }.`;

    this.utilsService.confirmationDialog('Suppression', message, (confirm) => {
      if (confirm && storageElement) {
        this.fileService.deleteStorageElements([storageElement.id]);
      }
    });
  }

  get isMultiActionDisable() {
    const checkedFiles =
      this.fileService.multiCheck.file.subCheck.filter(
        (f: any) => f.completed == true
      ) || [];

    const checkedFolder =
      this.fileService.multiCheck.folder.subCheck.filter(
        (f: any) => f.completed == true
      ) || [];

    const checkConcate = checkedFiles.concat(checkedFolder);

    return checkConcate.length == 0;
  }

  onRename(storageElement: I_Folder | I_File | null, type: 'folder' | 'file') {
    const dialogRef = this.modalService.open(RenameComponent, {
      centered: true,
      windowClass: 'modal-global-class',
    });

    dialogRef.componentInstance.type = type;

    dialogRef.componentInstance[type] = storageElement;

    dialogRef.closed.subscribe((value) => {
      if (value && storageElement) {
        this.fileService.renameStorage(storageElement.id, value, type);
      }
    });
  }


  onArchive() {
    if (!this.isMultiActionDisable) {
      let message = 'Vous allez archiver ces elements.';

      this.utilsService.confirmationDialog(
        'Archive Miltiple',
        message,
        (confirm) => {
          if (confirm) {
            const checkedFiles =
              this.fileService.multiCheck.file.subCheck.filter(
                (f: any) => f.completed == true
              ) || [];

            const checkedFolder =
              this.fileService.multiCheck.folder.subCheck.filter(
                (f: any) => f.completed == true
              ) || [];

            const checkConcate = checkedFiles.concat(checkedFolder);

            this.fileService.archiveStorage(
              checkConcate.map((f: any) => f.id),
              true
            );
          }
        }
      );
    }
  }


  onArchiveSingle(
    storageElement: I_Folder | I_File | null,
    type: 'folder' | 'file'
  ) {
    let message = `Vous allez archiver ce ${
      type == 'folder' ? 'dossier' : 'fichier'
    }.`;

    this.utilsService.confirmationDialog('Archive', message, (confirm) => {
      if (confirm && storageElement) {
        this.fileService.archiveStorage([storageElement.id], true);
      }
    });
  }


  onDblClickFolder(folder: I_Folder | any) {
    this.fileService.foldersFilter$.next({
      ...(this.fileService.foldersFilter$.value as I_StorageFilter),
      archived: true,
      parentId: folder.id,
      pagination: {
        limit: this.fileService.foldersPagination$.value.limit as number,
        page: 0,
      } as I_StorageFilter['pagination'],
    });

    this.fileService.filesFilter$.next({
      ...(this.fileService.filesFilter$.value as I_StorageFilter),
      archived: true,
      parentId: folder.id,
      pagination: {
        limit: this.fileService.filesPagination$.value.limit as number,
        page: 0,
      } as I_StorageFilter['pagination'],
    });
  }


  onCopy() {

    if (this.fileService.multiCheck.file.subCheck.length > 0) {

      const filesToCopy = this.fileService.multiCheck.file.subCheck.filter((file: any) => file.completed == true);

      this.copyService.filesToCopy$.next(filesToCopy);

    } else {

      return;

    }

  }


  get canCopy() {

    if (this.fileService.multiCheck.file.subCheck.length > 0) {

      return true;

    } else {

      return false;

    }

  }


  onPaste() {

    let fileIds: number[] = this.copyService.filesToCopy$.value.map((mappedFile: I_File) => { return mappedFile.id });

    let parentId: number = this.activatedRoute.snapshot.params["parentId"] ?? null;

    this.copyService.pasteFiles(fileIds, parentId);

  }

  get canPaste() {

    if (this.copyService.filesToCopy$.value.length > 0) {

      return true;

    } else {

      return false;

    }

  }

}
