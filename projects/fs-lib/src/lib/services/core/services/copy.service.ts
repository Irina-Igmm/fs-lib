import { Injectable } from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, concatMap, delayWhen, filter, retry, retryWhen, take } from 'rxjs/operators';
import { I_File, I_Folder } from '../../../interfaces/interfaces/file.model';
import { ApiService } from '../../services/api.service';
import { StatusService } from '../../services/status.service';
import { FileService } from './file.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from '../../services/utils.service';

import _constants from '../../../interfaces/configs/constants.json'

@Injectable({
  providedIn: 'root'
})
export class CopyService {

  isCopyActivated$ = new BehaviorSubject<boolean>(false);

  filesToCopy$ = new BehaviorSubject<any[]>([]);

  constructor(
    private apiService: ApiService,
    private statusService: StatusService,
    private fileService: FileService,
    private activatedRoute: ActivatedRoute,
    private utilsService: UtilsService
  ) { }


  canCopy(): void {
  }


  pasteFiles(fileIds: number[], parentId: number | null) {

    this.apiService.copyFiles(fileIds, parentId).pipe(
      // retry(-1),
      retryWhen((errors) => errors.pipe(
        delayWhen(() => this.statusService.onlineStatus$.pipe(filter(online => !online))),
        take(1),
        concatMap(() => throwError('No internet connection, retrying... '))
      )),
      catchError((error) => {
        // console.error("error", error)
        return throwError('Something went wrong');
        // return of()
      })
    ).subscribe((res) => {

      if (res.status) {

        // if (this.fileService.filesList$.value.length > 0) {

          if (this.fileService.filesList$.value[0].parent.id == res.data[0].parent.id) {

            this.fileService.filesList$.next([
              ... res.data,
              ... this.fileService.filesList$.value
            ]);

            this.filesToCopy$.next([]);

            this.utilsService.showSuccessMessage(_constants.messages.success.copySuccess.title, _constants.messages.success.copySuccess.message);

          } else {

            this.utilsService.showSuccessMessage(_constants.messages.success.copySuccess.title, _constants.messages.success.copySuccess.message)

          }

        // } else {

        //   this.utilsService.showSuccessMessage(_constants.messages.success.copySuccess.title, _constants.messages.success.copySuccess.message)

        // }





        // let originalFolderList: I_File[] = this.fileService.filesList$.value.filter(file => {
        //   return !fileIds.includes(file.id as number)
        // });

        // this.fileService.filesList$.next(originalFolderList);

      }

    })

  }



  moveStorages(fileIds: number[], folderIds: number[], parentId: number) {

    const storageIds: number[] = [... fileIds, ... folderIds];
    console.log('PARENT ID IN API', parentId)

    this.apiService.moveStorage(storageIds, parentId).pipe(
      retry(-1),
      retryWhen((errors) => errors.pipe(
        delayWhen(() => this.statusService.onlineStatus$.pipe(filter(online => !online))),
        take(1),
        concatMap(() => throwError('No internet connection, retrying... '))
      )),
      catchError((error) => {
        // console.error("error", error)
        return throwError('Something went wrong');
        // return of()
      })
    ).subscribe((res) => {

      if (res.status) {

        let originalFolderList: I_Folder[] = this.fileService.foldersList$.value.filter(folder => {
          return !folderIds.includes(folder.id as number)
        });

        this.fileService.foldersList$.next(originalFolderList);

        let newFolderMultiCheckValue = this.fileService.multiCheck.folder.subCheck.filter((folder: any) => {
          return !folderIds.includes(folder.id);
        });

        this.fileService.multiCheck.folder.subCheck = newFolderMultiCheckValue;




        let originalFileList: I_File[] = this.fileService.filesList$.value.filter(file => {
          return !fileIds.includes(file.id as number)
        });

        this.fileService.filesList$.next(originalFileList);

        let newFileMultiCheckValue = this.fileService.multiCheck.file.subCheck.filter((file: any) => {
          return !fileIds.includes(file.id);
        });

        this.fileService.multiCheck.file.subCheck = newFileMultiCheckValue;

      }

    });

  }
}
