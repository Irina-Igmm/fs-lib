import { Injectable } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { retry, catchError, retryWhen, delayWhen, filter, take, concatMap } from 'rxjs/operators';
import { FileService } from './file.service';
import { I_File } from '../../../interfaces/interfaces/file.model';
import { I_Folder } from '../../../interfaces/interfaces/file.model';
import { of, throwError } from 'rxjs';
import { StatusService } from '../../services/status.service';

@Injectable({
  providedIn: 'root'
})
export class MoveService {

  constructor(
    private apiService: ApiService,
    private fileService: FileService,
    private statusService: StatusService
  ) { }


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
