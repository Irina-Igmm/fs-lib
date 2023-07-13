import { Injectable } from '@angular/core';
import { I_APIRes, I_ResolveForkJoin } from '../../interfaces/interfaces/api.model';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { I_StorageFilter } from '../../interfaces/interfaces/storage-filter';
import { catchError, debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs/operators';
import { ApiService } from '../services/api.service';
import { I_File, I_Folder } from '../../interfaces/interfaces/file.model';
import { I_PaginationData } from '../../interfaces/interfaces/pagination-data';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { T_Storage } from '../../interfaces/interfaces';
import { HttpErrorResponse } from '@angular/common/http';
import { UtilsService } from '../services/utils.service';
import _constants from '../../interfaces/configs/constants.json';
import { ActivatedRoute } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class SearchService {

  searchResults$ = new BehaviorSubject<any[]>([]);

  searchFilter$ = new BehaviorSubject<I_StorageFilter | null>(null);

  newFolder = new BehaviorSubject<I_Folder | null>(null);

  searchPagination$ = new BehaviorSubject<I_PaginationData>({
    page: 0,
    limit: 2,
    totalElements: 0,
    totalPages: Infinity,
  });

  multiCheck = {
    folder: {
      completed: false,
      subCheck: [] as (any | any[]),
    },
    file: {
      completed: false,
      subCheck: [] as (any | any[]),
    },
  };

  storageMultiCheck = {
    completed: false,
    subCheck: [] as (any | any[])
  }

  isStorageLoading: boolean = false;


  constructor(
    private apiService: ApiService,
    private utilsService: UtilsService,
    private activatedRoute: ActivatedRoute
  ) {

    this.searchFilter$
    .pipe(
      filter((val) => val != null),
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((filterData) => {

        const searchValue: string = this.activatedRoute.snapshot.queryParams['text'];

        return this.apiService.searchStorage(
          searchValue,
          filterData as I_StorageFilter
        );
      })
    )
    .subscribe((result) => {

      if (result.status) {

        if(this.searchFilter$.value?.pagination?.page == 0){

          this.searchResults$.next([
            ...(result.data.content as any[]),
          ]);

        } else {

          this.searchResults$.next([
            ...this.searchResults$.value,
            ...(result.data.content as any[]),
          ]);

        }

        this.initStorageCheck();

        this.searchPagination$.next({
          ...this.searchPagination$.value,
          page: result.data.pageable?.pageNumber,
          limit: result.data.size,
          totalElements: result.data.totalElements,
          totalPages: (result.data.totalPages as number) == 0 ? (result.data.totalPages as number) : (result.data.totalPages as number)
        });


        console.log('SEARCH PAGINATION', this.searchPagination$.value)
      }

      this.isStorageLoading = false;

    });

  }


  hydrate(data: I_ResolveForkJoin) {

    if (data.filesList) {

      console.log('HYDRATE', data.filesList)

      this.searchResults$.next(data.filesList as any[]);

      this.initStorageCheck()

    }

  }


  initFileCheck() {
    this.multiCheck['file'].subCheck = [
      ...this.searchResults$.value.map((file) => {
        const newFile = JSON.parse(
          JSON.stringify({ ...file, completed: false })
        );


        return newFile;
      }),
    ];
  }


  initStorageCheck() {

    this.storageMultiCheck.subCheck = [
      ...this.searchResults$.value.map((storage) => {
        const newStorage = JSON.parse(
          JSON.stringify({... storage, completed: false})
        );

        return newStorage;
      })
    ]
  }



  /**
   * @deprecated
  */
  multiCheckChange(
    value: MatCheckboxChange,
    folderId: number,
    type: 'folder' | 'file'
  ) {
    const find: any = (this.multiCheck[type].subCheck as any[]).find(
      (sub: any) => sub.id == folderId
    );

    find.completed = value.checked;

    const completedCount: any[] = this.multiCheck[type].subCheck?.filter(
      (folder: any) => folder.completed
    ).length;

    if (completedCount < this.multiCheck[type].subCheck?.length) {
      this.multiCheck[type].completed = false;
    } else {
      this.multiCheck[type].completed = true;
    }
  }


  storageMultiCheckChange(value: MatCheckboxChange, storageId: number) {

    const find: any = (this.storageMultiCheck.subCheck as any[]).find(
      (sub: any) => sub.id == storageId
    );

    find.completed = value.checked;

    const completedCount: any[] = this.storageMultiCheck.subCheck?.filter(
      (folder: any) => folder.completed
    ).length;

    if (completedCount < this.storageMultiCheck.subCheck?.length) {
      this.storageMultiCheck.completed = false;
    } else {
      this.storageMultiCheck.completed = true;
    }

  }


  /**
   * @deprecated
  */
  completeCheckSome(type: 'folder' | 'file') {
    if (this.multiCheck[type].subCheck == null) {
      return false;
    }

    return (
      this.multiCheck[type].subCheck.filter((t: any) => t.completed).length >
        0 && !this.multiCheck[type].completed
    );
  }


  storageCompleteCheckSome() {

    if (this.storageMultiCheck.subCheck == null) {
      return false;
    }

    return (
      this.storageMultiCheck.subCheck.filter((t: any) => t.completed).length >
        0 && !this.storageMultiCheck.completed
    );

  }

  setCheckAll(completed: boolean, type: 'folder' | 'file') {
    this.multiCheck[type].completed = completed;

    if (this.multiCheck[type].subCheck == null) {
      return;
    }

    this.multiCheck[type].subCheck.forEach(
      (t: any) => (t.completed = completed)
    );
  }


  storageSetCheckAll(completed: boolean) {
    this.storageMultiCheck.completed = completed;

    if (this.storageMultiCheck.subCheck == null) {
      return;
    }

    this.storageMultiCheck.subCheck.forEach(
      (t: any) => (t.completed = completed)
    );
  }


  initFolderCheck() {
    this.multiCheck['folder'].subCheck = [
      ...this.searchResults$.value.map((folder) => {
        const newFolder = JSON.parse(
          JSON.stringify({ ...folder, completed: false })
        );

        return newFolder;
      }),
    ];
  }


  mouseDownOnFile(file: I_File) {



  }


  mouseDownOnFolder(index: number, type: T_Storage) {

    if (type == 'folder') {

      for (let subcheckIndex = 0; subcheckIndex < this.multiCheck.folder.subCheck.length; subcheckIndex ++) {

        if (index != subcheckIndex) {
          this.multiCheck.folder.subCheck[subcheckIndex].completed = false;
        } else {
          this.multiCheck.folder.subCheck[subcheckIndex].completed = true;
        }

      }

      for (let subcheckIndex = 0; subcheckIndex < this.multiCheck.file.subCheck.length; subcheckIndex ++) {

          this.multiCheck.file.subCheck[subcheckIndex].completed = false;

      }

      if (this.multiCheck.folder.subCheck.length == 1) {
        this.multiCheck.folder.completed = true;
      }

      this.multiCheck.file.completed = false;

    } else if (type == 'file') {

      for (let subcheckIndex = 0; subcheckIndex < this.multiCheck.file.subCheck.length; subcheckIndex ++) {

        if (index != subcheckIndex) {
          this.multiCheck.file.subCheck[subcheckIndex].completed = false;
        } else {
          this.multiCheck.file.subCheck[subcheckIndex].completed = true;
        }

        for (let subcheckIndex = 0; subcheckIndex < this.multiCheck.folder.subCheck.length; subcheckIndex ++) {

          this.multiCheck.folder.subCheck[subcheckIndex].completed = false;

        }

        if (this.multiCheck.file.subCheck.length == 1) {
          this.multiCheck.file.completed = true;
        }

        this.multiCheck.folder.completed = false;

      }

    }

  }



  mouseDownOnStorage(index: number) {

    for (let subcheckIndex = 0; subcheckIndex < this.storageMultiCheck.subCheck.length; subcheckIndex ++) {

      if (index != subcheckIndex) {
        this.storageMultiCheck.subCheck[subcheckIndex].completed = false;
      } else {
        this.storageMultiCheck.subCheck[subcheckIndex].completed = true;
      }

    }

    if (this.storageMultiCheck.subCheck.length <= 1) {
      this.storageMultiCheck.completed = true;
    } else {
      this.storageMultiCheck.completed = false;
    }

  }


  deleteStorageElements(storageIds: number[]) {
    this.apiService.deleteStorageElements(storageIds)
    .subscribe(res => {
      if(res.status) {

        this.deleteRestoreElementOnFront(res.data, 'delete');

      }
    })
  }


  private deleteRestoreElementOnFront(elements: (I_Folder | I_File)[], action: 'delete' | 'restore'){
    elements.forEach((deletedOrRestore: I_Folder | I_File) => {

        if(action == 'delete'){
        // list
        const indexFolder = this.searchResults$.value.findIndex(f => f.id == deletedOrRestore.id);

        if(indexFolder != -1) {
          this.searchResults$.value.splice(indexFolder, 1)
        }

        const indexFiles = this.searchResults$.value.findIndex(f => f.id == deletedOrRestore.id);

        if(indexFiles != -1) {
          this.searchResults$.value.splice(indexFiles, 1)
        }

        //  check

        const folderSubcheckIndex = this.multiCheck.folder.subCheck
                        .findIndex((f: any) => f.id == deletedOrRestore.id);

        if(folderSubcheckIndex != -1) {
          this.multiCheck.folder.subCheck
                        .splice(folderSubcheckIndex, 1);
        }

        const filesSubcheckIndex = this.multiCheck.folder.subCheck
                        .findIndex((f: any) => f.id == deletedOrRestore.id);

        if(filesSubcheckIndex != -1) {
          this.multiCheck.file.subCheck
                        .splice(filesSubcheckIndex, 1);
        }
      }
      else {
        // for restore archive

      }
    })
  }


  renameStorage(id: number, newName: string, type: 'folder' | 'file'){

    this.apiService.renameStorageElement(id, newName)
        .subscribe(
          res => {
            if(res.status){

              if(type == 'folder') {
                const find = this.searchResults$.value.find(f => f.id == id);

                if(find){

                  find.name = newName;

                  this.initFolderCheck()

                }
              }
              else {
                const find = this.searchResults$.value.find(f => f.id == id);

                if(find){

                  find.name = newName;

                  this.initFileCheck()

                }
              }

            }

          }
        )
  }

  archiveStorage(elementIds: number[], archive: boolean){

    this.apiService.archiveStorageElement(elementIds, archive)
        .subscribe(
          res => {

            if(res.status){

              this.deleteRestoreElementOnFront(res.data, 'delete');

            }
          }
        )

  }

  sharedStorage(elementIds: number[], share: boolean){

    this.apiService.shareStorageElement(elementIds, share)
        .subscribe(
          res => {

            if(res.status){

              console.log({res})

            }
          }
        )

  }


  onDownload() {

    const checkedFiles = this.multiCheck.file.subCheck
            .filter((f: any) => f.completed == true) || [];


    const checkedFolders = this.multiCheck.folder.subCheck
            .filter((f: any) => f.completed == true) || [];

    const storageIds: number[] = [... checkedFiles, ... checkedFolders];

    this.downloadStorageElements(storageIds);

  }


  downloadStorageElements(storageIds: number[]) {

    let downloadStorage = (
      error: HttpErrorResponse,
      cauthData: Observable<I_APIRes>
    ) => {
      if (error.status === 0) {
        // A client-side or network error occurred. Handle it accordingly.
        console.error('An error occurred:', error.error);
        this.utilsService.showErrorMessage(
          _constants.messages.error.verifyConnexion.title, _constants.messages.error.verifyConnexion.message
        );
      } else {
        console.error(
          `Backend returned code ${error.status}, body was: `,
          error.error
        );

        this.utilsService.showErrorMessage(
          _constants.messages.error.tryAgain.title, _constants.messages.error.tryAgain.message
        );
      }

      return throwError(
        () => new Error('Something bad happened; please try again later.')
      );
    };

    this.apiService.downloadStorageElements(storageIds).pipe(
      catchError(downloadStorage)
    ).subscribe(res => {
      if (res.status) {

        this.utilsService.downloadFileFromBase64(res.data, "storage");

      } else {
        throw new Error("Echec du téléchargement");
      }
    })

  }


}
