import { Injectable } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';

import { BehaviorSubject, EMPTY, Observable, Subject, Subscription, forkJoin, of, pipe, throwError } from 'rxjs';

import {
  I_APIRes,
  I_FilesUploadFilter,
  I_Filter,
  I_FolderTree,
  I_FoldersUploadFilter,
  I_ResolveForkJoin,
  I_UploadProgress,
} from '../../../interfaces/interfaces/api.model';
import {
  DisplayType,
  I_File,
  I_Folder,
  I_Storage,
} from '../../../interfaces/interfaces/file.model';
import { I_User } from '../../../interfaces/interfaces/user.model';
import { ApiService } from '../../services/api.service';

import { ExitStatus, Identifier } from 'typescript';

import { I_StorageFilter } from '../../../interfaces/interfaces/storage-filter';

import {
  filter,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  map,
  mergeMap,
  concatMap,
  catchError,
  takeUntil,
  skipWhile,
  finalize,
  takeWhile,
} from 'rxjs/operators';

import { I_CustomService } from '../../../interfaces/interfaces/custom-service';
import { I_PaginationData } from '../../../interfaces/interfaces/pagination-data';
import { GeneralService } from '../../services/general.service';
import { UtilsService } from '../../services/utils.service';
import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { UploadStoreService } from '../../services/upload-store.service';
import _constants from '../../../interfaces/configs/constants.json';
import { T_Storage } from '../../../interfaces/interfaces';
import { ActivatedRoute } from '@angular/router';


@Injectable({
  providedIn: 'root',
})
export class FileService implements I_CustomService {
  newFolder = new BehaviorSubject<I_Folder | null>(null);

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

  // ! For testing :
  connectedUser: I_User = {
    id: '0',
    lastname: 'Doe',
    firstname: 'John',
    email: 'john.doe@test.com',
    display_mode: {
      id: '1',
      display_mode: 'LIST',
    },
  };

  filesList$ = new BehaviorSubject<I_File[]>([]);

  foldersList$ = new BehaviorSubject<I_Folder[]>([]);

  filesFilter$ = new BehaviorSubject<I_StorageFilter | null>(null);

  recentList$ = new BehaviorSubject<I_Folder[] | I_File[]>([]);

  foldersFilter$ = new BehaviorSubject<I_StorageFilter | null>(null);

  storageFilter$ = new BehaviorSubject<I_StorageFilter | null>(null);

  filesPagination$ = new BehaviorSubject<I_PaginationData>({
    page: 0,
    limit: 15,
    totalElements: 0,
    totalPages: 0,
  });

  foldersPagination$ = new BehaviorSubject<I_PaginationData>({
    page: 0,
    limit: 15,
    totalElements: 0,
    totalPages: Infinity,
  });


  isFilesLoading: boolean = false;

  isFoldersLoading: boolean = false;

  checkedFolderList$ = new BehaviorSubject<number[]>([]);

  progress = new Subject<number>();

  selectedFiles!: FileList;
  progressInfos: any[] = [];
  message = '';

  uploadProgress$: Subject<number> = new Subject<number>();


  private subscription: Subscription = new Subscription();


  private childSubscriptionss: Subscription[] = [];


  private childSubscriptions: {subscriptionId: string, subscription: Subscription}[] = [];


  private stopSignal$ = new Subject();


  public uploadSubscriptions: {id: string, request: Subscription}[] = [];


  /**
   * @deprecated
   */
  fileListSubject$ = new BehaviorSubject<I_File[]>([] as I_File[]);
  /**
   * @deprecated
   */
  fileListLoading$ = new BehaviorSubject<Boolean>(true);
  /**
   * @deprecated
   */
  fileList$ = this.fileListSubject$.asObservable();
  /**
   * @deprecated
   */
  fileFilter$ = new BehaviorSubject<I_Filter | null>(null);
  /**
   * @deprecated
   */
  page$ = new BehaviorSubject<number>(0);
  /**
   * @deprecated
   */
  limit$ = new BehaviorSubject<number>(10);

  userDisplayMode$ = new BehaviorSubject<DisplayType>('Grid');

  actualId: string = "";

  actualFolderId: string = "";

  folderSubsription: Subscription;

  constructor(
    private apiService: ApiService,
    private generalService: GeneralService,
    private utilsService: UtilsService,
    private uploadStoreService: UploadStoreService,
    private activatedRoute: ActivatedRoute
  ) {
    this.filesFilter$
      .pipe(
        filter((val) => val != null),
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((filterData) => {
          return this.apiService.getPaginatedFileList(
            filterData as I_StorageFilter,
            filterData?.parentId || null,
            filterData?.archived
          );
        })
      )
      .subscribe((result) => {
        if (result.status) {

          if(this.filesFilter$.value?.pagination?.page == 0){

            this.filesList$.next([
              ...(result.data.content as I_File[]),
            ]);

          } else {

            this.filesList$.next([
              ...this.filesList$.value,
              ...(result.data.content as I_File[]),
            ]);

          }

          this.initFileCheck();

          this.filesPagination$.next({
            ...this.filesPagination$.value,
            // page: result.data.number,
            page: result.data.pageable?.pageNumber,
            limit: result.data.size,
            totalElements: result.data.totalElements,
            totalPages: (result.data.totalPages as number) == 0 ? (result.data.totalPages as number) : (result.data.totalPages as number)
          });
        }

        this.isFilesLoading = false;
      });

    this.foldersFilter$
      .pipe(
        filter((val) => val != null),
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((filterData) => {
          return this.apiService.getPaginatedFolderList(
            filterData as I_StorageFilter,
            filterData?.parentId || null,
            filterData?.archived
          );
        })
      )
      .subscribe((result) => {
        if (result.status) {

          if(this.filesFilter$.value?.pagination?.page == 0){

            this.foldersList$.next([
              ...(result.data.content as I_Folder[]),
            ]);

          }
          else {

            this.foldersList$.next([
              ...this.foldersList$.value,
              ...(result.data.content as I_Folder[]),
            ]);

          }


          this.initFolderCheck();

          this.foldersPagination$.next({
            ...this.foldersPagination$.value,
            // page: result.data.number,
            page: result.data.pageable?.pageNumber,
            limit: result.data.size,
            totalElements: result.data.totalElements,
            totalPages: (result.data.totalPages as number) == 0 ? (result.data.totalPages as number) : (result.data.totalPages as number)
          });

          this.isFoldersLoading = false;

        }
      });


    this.generalService.filesReadyForUpload$
      .pipe(
        filter((val) => val != null),

        concatMap((data) => {

          if (this.isFileCanceled(data as I_FilesUploadFilter)) {

            this.emitStopSignal(data as I_FilesUploadFilter);

            return of();

          }

          let originalFileList = this.uploadStoreService.filesToDisplay$.value;

          let newFileIndex = this.uploadStoreService.filesToDisplay$.value.findIndex(res => res.uniqueId == data?.activeId);

          originalFileList[newFileIndex].progress = 0;
          originalFileList[newFileIndex].status = "in-progress";

          this.uploadStoreService.filesToDisplay$.value[newFileIndex].progress = 0;
          this.uploadStoreService.filesToDisplay$.value[newFileIndex].status = "in-progress";

          this.actualId = data?.activeId as string;

          return this.apiService.uploadFiles(
            data?.files as FileList,
            data?.parentId as number
          ).pipe(
            takeUntil(this.stopSignal$),
            takeWhile(event => {

              let actualUploading = this.uploadStoreService.filesToDisplay$.value.find(file => file.uniqueId == this.actualId);

              if (actualUploading?.status == "canceled") {

                return false;

              } else {return true}

            }),
            catchError((error) => {
              console.error(error);

              let originalFileList = this.uploadStoreService.filesToDisplay$.value

              let newFile = (this.uploadStoreService.filesToDisplay$.value.find(res => res.uniqueId == data?.activeId)) as I_UploadProgress;
              let newFileIndex = this.uploadStoreService.filesToDisplay$.value.findIndex(res => res.uniqueId == data?.activeId);

              originalFileList[newFileIndex].progress = 0;
              originalFileList[newFileIndex].status = "failed";

              this.uploadStoreService.filesToDisplay$.next(originalFileList);

              this.progress.next(0);
              // Continue with other values by returning an empty observable
              return of();
            }))
        })
      ).subscribe((result: HttpEvent<any> | any) => {

        if (result.type === HttpEventType.UploadProgress) {

          const percentDone = Math.round((100 * result.loaded) / (result.total ?? 1));

          let displayedFiles = this.uploadStoreService.filesToDisplay$.value

          console.log("FILE TO DISPLAY", displayedFiles)

          let newFiles: I_UploadProgress[]= displayedFiles.map(file => {
            if (file.uniqueId == this.actualId) {
              file.progress = percentDone;
              file.type = "file";
            }

            return file;
          });

          this.uploadStoreService.filesToDisplay$.next(newFiles);

          this.progress.next(percentDone);

          if (percentDone === 100) {
            this.progress.complete();
          }

        } else if (result.type === HttpEventType.Response) {

          let displayedFiles = this.uploadStoreService.filesToDisplay$.value

          let newFiles: I_UploadProgress[]= displayedFiles.map(file => {
            if (file.uniqueId == this.actualId) {
              id: result.body.data.length > 0 ? result.body.data[0].id : null
            }

            return file;
          });

          this.uploadStoreService.filesToDisplay$.next(newFiles);
          // console.log("BODY", result.body);
          // console.log("BODY", result.body, this.uploadStoreService.filesToDisplay$.value);

        }

        this.initFileCheck();

        console.log("UPLOAD RES", result)
      })





    this.folderSubsription = this.generalService.foldersReadyForUpload$
      .pipe(
        filter(val => val != null),
        concatMap((data) => {

          if (this.isFileInFolderCanceled(data as I_FoldersUploadFilter)) {

            this.emitStopSignal(data as I_FoldersUploadFilter);

            return of();

          }

              let originalFileList = this.uploadStoreService.filesToDisplay$.value;

              let newFileIndex = this.uploadStoreService.filesToDisplay$.value.findIndex(res => res.uniqueId == data?.activeId);

              originalFileList[newFileIndex].progress = 0;
              originalFileList[newFileIndex].status = "in-progress";

              this.uploadStoreService.filesToDisplay$.value[newFileIndex].progress = 0;
              this.uploadStoreService.filesToDisplay$.value[newFileIndex].status = "in-progress";

          this.actualFolderId = data?.activeId as string;

          let childSubscription = this.apiService.uploadFileFromFolder({file: data?.file as File, parentId: (data?.parentId as number) ?? null, path: data?.path as string}).pipe(
            takeUntil(this.stopSignal$),
            takeWhile(event => {

              let actualUploading = this.uploadStoreService.filesToDisplay$.value.find(file => file.uniqueId == this.actualFolderId);

              if (actualUploading?.status == "canceled") {

                return false;

              } else {return true}

            }),
            catchError((error) => {

              console.error(error);

              let originalFileList = this.uploadStoreService.filesToDisplay$.value;

              let newFile = (this.uploadStoreService.filesToDisplay$.value.find(res => res.uniqueId == data?.activeId)) as I_UploadProgress;
              let newFileIndex = this.uploadStoreService.filesToDisplay$.value.findIndex(res => res.uniqueId == data?.activeId);

              originalFileList[newFileIndex].progress = 0;
              originalFileList[newFileIndex].status = "failed";

              this.uploadStoreService.filesToDisplay$.next(originalFileList);

              this.progress.next(0);

              // Continue with other values by returning an empty observable
              return of();
            }),
            // finalize(() => {alert('finalize'); this.stopSignal$})
            );

            return childSubscription;

        })
      ).subscribe(

        (result: HttpEvent<any> | any) => {

          let actualUploading = this.uploadStoreService.filesToDisplay$.value.find(file => file.uniqueId == this.actualFolderId)

        if (result.type === HttpEventType.UploadProgress) {

          const percentDone = Math.round((100 * result.loaded) / (result.total ?? 1));

          let displayedFiles = this.uploadStoreService.filesToDisplay$.value;

          // let actualFolderUploadFilter = this.generalService.foldersReadyForUpload$.value.find(file => file.uniqueId == this.actualFolderId)

          console.log('ACTUAL FILE', actualUploading);



          let newFiles: I_UploadProgress[]= displayedFiles.map(file => {
            if (file.uniqueId == this.actualFolderId) {
              file.progress = percentDone;
              file.type = "file";
            }

            return file;
          });

          this.uploadStoreService.filesToDisplay$.next(newFiles);

          this.progress.next(percentDone);

          if (percentDone === 100) {
            this.progress.complete();
          }

        } else if (result.type === HttpEventType.Response) {

          // return EMPTY

          let displayedFiles = this.uploadStoreService.filesToDisplay$.value

          let newFiles: I_UploadProgress[]= displayedFiles.map(file => {
            if (file.uniqueId == this.actualFolderId) {
              id: result.body.data.length > 0 ? result.body.data[0].id : null
            }

            return file;
          });

          this.uploadStoreService.filesToDisplay$.next(newFiles);

        }

        console.log('FOLDER CONTENT UPLOAD RES', result);

        // if (this.stopSignal$) {
        //   result.complete()
        // }

      }, (error) => {alert(error)})
      // .add((subscription: any) => {this.childSubscriptionss.push(subscription); console.log('SUBSCRIPTION LIST', this.childSubscriptionss);});

      // console.log('SUBSCRIPTION LIST', this.childSubscriptionss, folderSubsription);

    this.getFilesDisplayMode(
      this.connectedUser.display_mode?.display_mode as DisplayType
    );


  }


  isFileInFolderCanceled(fileToVerify: I_FoldersUploadFilter) {

    let theFile = this.uploadStoreService.filesToDisplay$.value.findIndex(file => file.uniqueId == fileToVerify.activeId);

    let newFilesToDisplay = this.uploadStoreService.filesToDisplay$.value;

    console.log('IS FILE INFO FOLDER CANCELED', newFilesToDisplay, theFile, fileToVerify)

    if (newFilesToDisplay[theFile].status == "canceled") {

      return true;

    }

    return false;

  }


  isFileCanceled(fileToVerify: I_FilesUploadFilter) {

    let theFile = this.uploadStoreService.filesToDisplay$.value.findIndex(file => file.uniqueId == fileToVerify.activeId);

    let newFilesToDisplay = this.uploadStoreService.filesToDisplay$.value;

    console.log('IS FILE INFO FOLDER CANCELED', newFilesToDisplay, theFile, fileToVerify)

    if (newFilesToDisplay[theFile].status == "canceled") {

      return true;

    }

    return false;

  }


  // Emit the stop signal based on your logic
  emitStopSignal(fileToVerify: I_FoldersUploadFilter | I_FilesUploadFilter) {

    let theFile = this.uploadStoreService.filesToDisplay$.value.findIndex(file => file.uniqueId == fileToVerify.activeId);

    let newFilesToDisplay = this.uploadStoreService.filesToDisplay$.value;

    if (newFilesToDisplay[theFile].status == "canceled") {

      this.stopSignal$.next();

    }

  };


  uploadFileFromFolder(fileDetails: I_FoldersUploadFilter) {

    // let a = of(1,2,3)

    const uploadFileSubscription = of(fileDetails)
    .pipe(
      filter(val => val != null),
      concatMap((data) => {

        if (this.isFileInFolderCanceled(data)) {

          this.emitStopSignal(data);

          return of();

        };

        let originalFileList = this.uploadStoreService.filesToDisplay$.value;

        let newFileIndex = this.uploadStoreService.filesToDisplay$.value.findIndex(res => res.uniqueId == data.activeId);

        originalFileList[newFileIndex].progress = 0;
        originalFileList[newFileIndex].status = "waiting";

        this.uploadStoreService.filesToDisplay$.value[newFileIndex].progress = 0;
        this.uploadStoreService.filesToDisplay$.value[newFileIndex].status = "waiting";

        this.actualFolderId = data.activeId as string;

        let childSubscription = this.apiService.uploadFileFromFolder({file: data.file as File, parentId: (data.parentId as number) ?? null, path: data.path as string}).pipe(
          takeUntil(this.stopSignal$),
          catchError((error) => {

            console.error(error);

              let originalFileList = this.uploadStoreService.filesToDisplay$.value;

              let newFile = (this.uploadStoreService.filesToDisplay$.value.find(res => res.uniqueId == data?.activeId)) as I_UploadProgress;
              let newFileIndex = this.uploadStoreService.filesToDisplay$.value.findIndex(res => res.uniqueId == data?.activeId);

              originalFileList[newFileIndex].progress = 0;
              originalFileList[newFileIndex].status = "failed";

              this.uploadStoreService.filesToDisplay$.next(originalFileList);

              this.progress.next(0);
              // Continue with other values by returning an empty observable
              return of();

          })
        );

        return childSubscription;

      })
    ).subscribe((result: HttpEvent<any> | any) => {

      if (result.type === HttpEventType.UploadProgress) {

        const percentDone = Math.round((100 * result.loaded) / (result.total ?? 1));

        let displayedFiles = this.uploadStoreService.filesToDisplay$.value

        let newFiles: I_UploadProgress[]= displayedFiles.map(file => {
          if (file.uniqueId == this.actualFolderId) {
            file.progress = percentDone;
            file.type = "file";
          }

          return file;
        });

        this.uploadStoreService.filesToDisplay$.next(newFiles);

        this.progress.next(percentDone);

        if (percentDone === 100) {
          this.progress.complete();
        }

      } else if (result.type === HttpEventType.Response) {

        let displayedFiles = this.uploadStoreService.filesToDisplay$.value

        let newFiles: I_UploadProgress[]= displayedFiles.map(file => {
          if (file.uniqueId == this.actualFolderId) {
            id: result.body.data.length > 0 ? result.body.data[0].id : null
          }

          return file;
        });

        this.uploadStoreService.filesToDisplay$.next(newFiles);

      }

      console.log('FOLDER CONTENT UPLOAD RES', result);

    });


    this.uploadSubscriptions.push({id: fileDetails.activeId as string, request: uploadFileSubscription});


  }


  testSub() {

    console.log("SUBSCRIPTION", this.subscription);
    console.log("CHILD SUBSCRIPTION", this.childSubscriptions);

  }


  setUploadProgress(progress: number) {
    this.uploadProgress$.next(progress);
  }

  initFileCheck() {
    this.multiCheck['file'].subCheck = [
      ...this.filesList$.value.map((file) => {
        const newFile = JSON.parse(
          JSON.stringify({ ...file, completed: false })
        );

        return newFile;
      }),
    ];
  }

  initFolderCheck() {
    this.multiCheck['folder'].subCheck = [
      ...this.foldersList$.value.map((folder) => {
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

  onDownload() {

    const checkedFiles = this.multiCheck.file.subCheck
            .filter((f: any) => f.completed == true).map((mapped: any) => {
              return mapped.id
            }) || [];


    const checkedFolders = this.multiCheck.folder.subCheck
            .filter((f: any) => f.completed == true) || [];

    const storageIds: number[] = [... checkedFiles, ... checkedFolders];

    this.downloadStorageElements(storageIds);

  }


  get filesList() {
    return this.filesList$;
  }

  get folderList() {
    return this.foldersList$;
  }

  get recentList() {
    return this.recentList$
  }

  // getFilesList(parent_id?: string) {
  //   this.apiService.getFilesList(parent_id).subscribe((res) => {
  //     this.fileListSubject$.next(res.data);
  //   });
  // }
  getFilesPaginated(parent_id?: string, params?: any) {
    this.apiService
      .getFilesPaginated(parent_id, params)
      .subscribe((res: any) => {
        console.log('service', res);

        this.fileListSubject$.next(res);
      });
  }

  setfileList(fileList: I_File[]) {
    this.fileListSubject$.next(fileList);
  }

  getFilesDisplayMode(display_mode: DisplayType) {
    if (display_mode.toString().toLocaleLowerCase() == 'grid') {
      this.userDisplayMode$.next('grid');
    } else {
      this.userDisplayMode$.next('list');
    }
  }

  hydrate(data: I_ResolveForkJoin) {
    console.table(data);

    if (data.filesList) {
      this.filesList$.next(data.filesList as I_File[]);

      this.initFileCheck();
    }

    if (data.folderList) {
      this.foldersList$.next(data.folderList as I_Folder[]);

      this.initFolderCheck();
    }

    if(data.recentList) {
      this.recentList$.next(data.recentList as I_File[] | I_Folder[]);
    }

  }
  // getFilesList(parent_id?: string) {
  //   this.apiService.getFilesList(parent_id).subscribe((res) => {
  //     this.fileListSubject$.next(res.data);
  //   })
  // }

  createFolder(input: Omit<I_Folder, 'id'>, parentId: number | null) {
    console.log('ACTUAL FOLDER', this.actualId, input);

    console.log('ACTUAL PARENT ID', this.activatedRoute.snapshot.params)
    this.apiService.createFolder(input, parentId).subscribe((result) => {
      if (result.status) {
        console.log(result.data);

        this.newFolder.next(result.data);

        this.foldersList$.next([
          this.newFolder.value as I_Folder,
          ...(this.foldersList$.value as I_Folder[]),
        ]);

        this.initFolderCheck()

        setTimeout(() => {
          this.newFolder.next(null);
        }, 6000);
      }
    });
  }

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




  completeCheckSome(type: 'folder' | 'file') {
    if (this.multiCheck[type].subCheck == null) {
      return false;
    }

    return (
      this.multiCheck[type].subCheck.filter((t: any) => t.completed).length >
        0 && !this.multiCheck[type].completed
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

  deleteStorageElements(storageIds: number[]) {
    this.apiService.deleteStorageElements(storageIds)
    .subscribe(res => {
      if(res.status) {

        this.deleteRestoreElementOnFront(res.data, 'delete');

      }
    })
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


  private deleteRestoreElementOnFront(elements: (I_Folder | I_File)[], action: 'delete' | 'restore'){
    elements.forEach((deletedOrRestore: I_Folder | I_File) => {

        if(action == 'delete'){
        // list
        const indexFolder = this.foldersList$.value.findIndex(f => f.id == deletedOrRestore.id);

        if(indexFolder != -1) {
          this.foldersList$.value.splice(indexFolder, 1)
        }

        const indexFiles = this.filesList$.value.findIndex(f => f.id == deletedOrRestore.id);

        if(indexFiles != -1) {
          this.filesList$.value.splice(indexFiles, 1)
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
                const find = this.foldersList$.value.find(f => f.id == id);

                if(find){

                  find.name = newName;

                  this.initFolderCheck()

                }
              }
              else {
                const find = this.filesList$.value.find(f => f.id == id);

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

}
