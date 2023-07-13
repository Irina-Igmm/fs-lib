import { Component, OnInit, Output } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { UtilsService } from '../../../services/services/utils.service';
import { I_File } from '../../../interfaces/interfaces/file.model';

import { Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, switchMap, filter } from 'rxjs/operators';

import { ApiService } from '../../../services/services/api.service';
import { I_PaginationRes } from '../../../interfaces/interfaces/api.model';
import { I_StorageFilter } from '../../../interfaces/interfaces/storage-filter';

import { FileService } from '../../../services/core/services/file.service';
import { CreateFolderComponent } from '../../features/dialog/create-folder/create-folder.component';
import { RenameComponent } from '../../features/dialog/rename/rename.component';
import { I_Folder } from '../../../interfaces/interfaces/file.model';
import { ActivatedRoute, Router } from '@angular/router';
import { DestinationSelectComponent } from '../../../components/destination-folder/destination-select/destination-select.component';
import { CopyService } from '../../../services/core/services/copy.service';


@Component({
  selector: 'app-my-files-list',
  templateUrl: './my-files-list.component.html',
  styleUrls: ['./my-files-list.component.scss']
})
export class MyFilesListComponent implements OnInit {

  // files: I_File[] = [];

  isFullListDisplayed: boolean = false;

  public subscription: Subscription = new Subscription();

  listView: boolean = true;

  folderContextData: I_Folder | any = null;

  fileContextData: I_Folder | any = null;

  queryParam!: string;
  queryParamsSubject = new Subject();

  constructor(
    public fileService: FileService,
    private apiService: ApiService,
    private modalService: NgbModal,
    private utilsService: UtilsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private copyService: CopyService
  ) {

    this.fileService.userDisplayMode$.subscribe((data)=> {
      console.log("view ", data);
      this.listView = data == 'list' ? true : false;
    })

    this.activatedRoute.queryParams.subscribe(params => {
      this.queryParam = params['myQueryParam'];
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

  get recentList() {
    return this.fileService.recentList
  }

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.filesList.value, event.previousIndex, event.currentIndex);
  }

  onScroll(event: any): void {
    this.fileService.page$.next(this.fileService.page$.value + 1);

    this.fileService.fileFilter$.next({
        ...this.fileService.fileFilter$.value,
        page: this.fileService.page$.value +1,
        limit: this.fileService.limit$.value
    });

  }

  getStorageList() {
    this.subscription.add(
      this.fileService.fileListSubject$.subscribe((data) => {
        if (data) {
          console.log("data source comp",data);
          this.filesList.next({...this.filesList.value, ...data});
        } else {
          this.filesList.next([]);
        }

      })
    );

    let obs = this.fileService.fileFilter$
      .pipe(
        debounceTime(500),
        switchMap((params) => {
          console.log("params",params);

          params = {
            ...params,
            page: this.fileService.page$.value,
            limit: this.fileService.limit$.value,
          };

          return this.apiService.getFilesPaginated<I_PaginationRes>(
            undefined,
            params
          );
        })
      )
      .subscribe((data: any) => {

        if (data && data.length > 0) {

          this.fileService.setfileList(data);
          this.fileService.fileListLoading$.next(false);
        } else {
          this.fileService.fileListLoading$.next(true);
        }
      });

    this.subscription.add(obs);
  }

  onFetchFolderMore(){
    this.fileService.foldersFilter$.next(
      {
        ...(this.fileService.foldersFilter$.value as I_StorageFilter ),
        archived: false,
        pagination: {
          limit: (this.fileService.foldersPagination$.value.limit as number),
          page: (this.fileService.foldersPagination$.value.page as number)+ 1,
        } as I_StorageFilter['pagination'],
      }
    )
  }


  onFetchFileMore(){
    this.fileService.filesFilter$.next(
      {
        ...(this.fileService.filesFilter$.value as I_StorageFilter ),
        archived: false,
        pagination: {
          limit: (this.fileService.filesPagination$.value.limit as number),
          page: (this.fileService.filesPagination$.value.page as number) + 1,
        } as I_StorageFilter['pagination'],
      }
    )
  }

  onReceiveContextData(data: any){
    //
    console.log({data})
  }

  onNewFolder(){
    //
    const dialogRef = this.modalService.open(CreateFolderComponent, {
      centered: true,
      windowClass: 'modal-global-class',
    });

    dialogRef.closed.subscribe((value) => {

      const parentId: number = this.activatedRoute.snapshot.params["parentId"];

      console.log({value})
      this.fileService.createFolder({
        name: value
      }, parentId)
    });
  }

  onDelete(){

    if(!this.isMultiActionDisable){
      let message = 'Vous allez supprimer ces elements.';

      this.utilsService.confirmationDialog(
        'Suppression multiple',
        message,
        (confirm) => {
          if(confirm){
            const checkedFiles = this.fileService.multiCheck.file.subCheck
            .filter((f: any) => f.completed == true) || [];

            const checkedFolder = this.fileService.multiCheck.folder.subCheck
                        .filter((f: any) => f.completed == true) || [];

            const checkConcate = checkedFiles.concat(checkedFolder);

            this.fileService.deleteStorageElements(checkConcate.map((f: any) => f.id));
          }
        }
      )

    }
  }


  onDeleteSingle(storageElement: I_Folder | I_File | null, type: 'folder' | 'file'){

    let message = `Vous allez supprimer ce ${type == 'folder' ? 'dossier' : 'fichier'}.`;

    this.utilsService.confirmationDialog(
      'Suppression',
      message,
      (confirm) => {
        if(confirm && storageElement){
          this.fileService.deleteStorageElements([storageElement.id]);
        }
      }
    );

  }


  onMove(){

    let fileIdsList: number [] = this.fileService.multiCheck.file.subCheck.filter((filtered: any) => filtered.completed == true).map((res: any) => { if (res.completed) return res.id });

    let folderIdsList: number [] = this.fileService.multiCheck.folder.subCheck.filter((filtered: any) => filtered.completed == true).map((res: any) => { if (res.completed) return res.id });

    let storageIdsToMove: number[] = [... fileIdsList, ... folderIdsList];

    const dialogRef = this.modalService.open(DestinationSelectComponent, {
      centered: true,
      windowClass: 'modal-global-class',
    });

    let parentId: number = this.activatedRoute.snapshot.params['parentId'];

    dialogRef.componentInstance.storageIdsToMove = storageIdsToMove;

    dialogRef.componentInstance['storageIdsToMove'] = storageIdsToMove;

    dialogRef.componentInstance.fileIdsToMove = fileIdsList;

    dialogRef.componentInstance['fileIdsToMove'] = fileIdsList;

    dialogRef.componentInstance.folderIdsToMove = folderIdsList;

    dialogRef.componentInstance['folderIdsToMove'] = folderIdsList

    dialogRef.componentInstance.parentId = parentId;

    dialogRef.componentInstance[parentId] = parentId

    // dialogRef.closed.subscribe((value) => {

    //   console.log({value})
    //   this.fileService.createFolder({
    //     name: value
    //   })
    // });

  }


  get isMultiActionDisable(){
    const checkedFiles = this.fileService.multiCheck.file.subCheck
                        .filter((f: any) => f.completed == true) || [];

    const checkedFolder = this.fileService.multiCheck.folder.subCheck
                        .filter((f: any) => f.completed == true) || [];

    const checkConcate = checkedFiles.concat(checkedFolder);

    return checkConcate.length == 0

  }

  onRename(storageElement: I_Folder | I_File | null, type: 'folder' | 'file'){
    const dialogRef = this.modalService.open(RenameComponent, {
      centered: true,
      windowClass: 'modal-global-class',
    });

    dialogRef.componentInstance.type = type;

    dialogRef.componentInstance[type] = storageElement;

    dialogRef.closed.subscribe((value) => {
      if(value && storageElement){
        this.fileService.renameStorage(storageElement.id, value, type );
      }
    });
  }

  onArchive(){

    if(!this.isMultiActionDisable){
      let message = 'Vous allez archiver ces elements.';

      this.utilsService.confirmationDialog(
        'Archive Miltiple',
        message,
        (confirm) => {
          if(confirm){
            const checkedFiles = this.fileService.multiCheck.file.subCheck
            .filter((f: any) => f.completed == true) || [];

            const checkedFolder = this.fileService.multiCheck.folder.subCheck
                        .filter((f: any) => f.completed == true) || [];

            const checkConcate = checkedFiles.concat(checkedFolder);

            this.fileService.archiveStorage(checkConcate.map((f: any) => f.id), true);
          }
        }
      )

    }
  }


  onArchiveSingle(storageElement: I_Folder | I_File | null, type: 'folder' | 'file'){

    let message = `Vous allez archiver ce ${type == 'folder' ? 'dossier' : 'fichier'}.`;

    this.utilsService.confirmationDialog(
      'Archive',
      message,
      (confirm) => {
        if(confirm && storageElement){
          this.fileService.archiveStorage([storageElement.id], true);
        }
      }
    );

  }

  onShared(storageElement: I_Folder | I_File | null, type: 'folder' | 'file'){

    let message = `Vous allez partager  ces elements.`;

    this.utilsService.confirmationDialog(
      'Partager',
      message,
      (confirm) => {
        if(confirm && storageElement){
          this.fileService.archiveStorage([storageElement.id], true);
        }
      }
    );

  }

  onDblClickFolder(folder: I_Folder) {

    this.router.navigate(['/storage/folders', folder.id], {skipLocationChange: false});

  }


  onFileDropped(event: {files: FileList, folder: {folder: HTMLElement | null, parentId: number | null}} | any) {
    console.log('DROPPED EVENT', event)
    console.log("ONE FILE", event.files)

    const folderInput: any = document.createElement('input');

    folderInput.type = 'file';
    folderInput.multiple = true;



    folderInput.addEventListener('change', async (event: any) => {

      console.log('INPUT CREATE ELEMENT', event);

    })
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


  onTest(event: any) {
    console.log('event', event)
  }

}
