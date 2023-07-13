import { Component, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { I_File, I_Folder } from '../../interfaces/interfaces/file.model';
import { SearchService } from '../../services/search/search.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { debounceTime, switchMap } from 'rxjs/operators';
import { I_StorageFilter } from '../../interfaces/interfaces/storage-filter';
import { CreateFolderComponent } from '../../files-modules/features/dialog/create-folder/create-folder.component';
import { UtilsService } from '../../services/services/utils.service';
import { RenameComponent } from '../../files-modules/features/dialog/rename/rename.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FileService } from '../../services/core/services/file.service';
import { CopyService } from '../../services/core/services/copy.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss']
})
export class SearchPageComponent implements OnInit {

  isFullListDisplayed: boolean = false;

  public subscription: Subscription = new Subscription();

  listView: boolean = true;

  folderContextData: I_Folder | any = null;

  fileContextData: I_Folder | any = null;

  queryParam!: string;
  queryParamsSubject = new Subject();

  constructor(
    public searchService: SearchService,
    private utilsService: UtilsService,
    private modalService: NgbModal,
    private fileService: FileService,
    private copyService: CopyService,
    private activatedRoute: ActivatedRoute
  ) {
    this.fileService.userDisplayMode$.subscribe((data)=> {
      console.log("view ", data);
      this.listView = data == 'list' ? true : false;
    })
  }

  ngOnInit(): void {
  }

  onFetchStorageMore(){
    this.searchService.searchFilter$.next(
      {
        ...(this.searchService.searchFilter$.value as I_StorageFilter ),
        archived: false,
        pagination: {
          limit: (this.searchService.searchPagination$.value.limit as number),
          page: (this.searchService.searchPagination$.value.page as number) + 1,
        } as I_StorageFilter['pagination'],
      }
    )
  }


  get storageList() {

    return this.searchService.searchResults$;

  }


  get filesList() {
    return this.searchService.searchResults$;
  }


  get foldersList() {
    return this.searchService.searchResults$;
  }


  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.filesList.value, event.previousIndex, event.currentIndex);
  }


  onFetchFolderMore(){
    this.searchService.searchFilter$.next(
      {
        ...(this.searchService.searchFilter$.value as I_StorageFilter ),
        archived: false,
        pagination: {
          limit: (this.searchService.searchPagination$.value.limit as number),
          page: (this.searchService.searchPagination$.value.page as number)+ 1,
        } as I_StorageFilter['pagination'],
      }
    )
  }

  onReceiveContextData(data: any){
    //
    console.log({data})
  }


  onDelete(){

    if(!this.isMultiActionDisable){
      let message = 'Vous allez supprimer ces elements.';

      this.utilsService.confirmationDialog(
        'Suppression multiple',
        message,
        (confirm) => {
          if(confirm){
            const checkedFiles = this.searchService.multiCheck.file.subCheck
            .filter((f: any) => f.completed == true) || [];

            const checkedFolder = this.searchService.multiCheck.folder.subCheck
                        .filter((f: any) => f.completed == true) || [];

            const checkConcate = checkedFiles.concat(checkedFolder);

            this.searchService.deleteStorageElements(checkConcate.map((f: any) => f.id));
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
          this.searchService.deleteStorageElements([storageElement.id]);
        }
      }
    );

  }

  get isMultiActionDisable(){
    const checkedFiles = this.searchService.storageMultiCheck.subCheck
                        .filter((f: any) => f.completed == true) || [];

    const checkedFolder = this.searchService.storageMultiCheck.subCheck
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
        this.searchService.renameStorage(storageElement.id, value, type );
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
            const checkedFiles = this.searchService.multiCheck.file.subCheck
            .filter((f: any) => f.completed == true) || [];

            const checkedFolder = this.searchService.multiCheck.folder.subCheck
                        .filter((f: any) => f.completed == true) || [];

            const checkConcate = checkedFiles.concat(checkedFolder);

            this.searchService.archiveStorage(checkConcate.map((f: any) => f.id), true);
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
          this.searchService.archiveStorage([storageElement.id], true);
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
          this.searchService.archiveStorage([storageElement.id], true);
        }
      }
    );

  }

  onDblClickFolder(folder: I_Folder) {

    this.searchService.searchFilter$.next(
      {
        ...(this.searchService.searchFilter$.value as I_StorageFilter ),
        archived: false,
        parentId: folder.id,
        pagination: {
          limit: (this.searchService.searchPagination$.value.limit as number),
          page: 0,
        } as I_StorageFilter['pagination'],
      }
    )

    this.searchService.searchFilter$.next(
      {
        ...(this.searchService.searchFilter$.value as I_StorageFilter ),
        archived: false,
        parentId: folder.id,
        pagination: {
          limit: (this.searchService.searchPagination$.value.limit as number),
          page: 0,
        } as I_StorageFilter['pagination'],
      }
    )

  }


  onFileDropped(event: {files: FileList, folder: {folder: HTMLElement | null, parentId: number | null}} |any) {
    console.log('DROPPED EVENT', event)
    console.log("ONE FILE", event.files)

    const folderInput: any = document.createElement('input');

    folderInput.type = 'file';
    folderInput.multiple = true;



    folderInput.addEventListener('change', async (event: any) => {

      console.log('INPUT CREATE ELEMENT', event);

    })
  }


  onFetchMoreStorage(){
    alert('')
    this.searchService.searchFilter$.next(
      {
        ...(this.searchService.searchFilter$.value as I_StorageFilter ),
        archived: false,
        pagination: {
          limit: (this.searchService.searchPagination$.value.limit as number),
          page: (this.searchService.searchPagination$.value.page as number) + 1,
        } as I_StorageFilter['pagination'],
      }
    )
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
