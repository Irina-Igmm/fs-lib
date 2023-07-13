import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';

import { Observable, forkJoin, of } from 'rxjs';

import { I_ResolveForkJoin } from '../../interfaces/interfaces/api.model';
import { I_CustomResolver } from '../../interfaces/interfaces/custom-resolver';
import { ApiService } from '../../services/services/api.service';
import { I_File, I_Folder } from '../../interfaces/interfaces/file.model';

import { FileService } from '../../services/core/services/file.service';
import { UtilsService } from '../../services/services/utils.service';

@Injectable({
  providedIn: 'root'
})
export class StorageArchivedListResolver implements Resolve<I_ResolveForkJoin>, I_CustomResolver {

  constructor(
    private utilsService: UtilsService,
    private apiService: ApiService,
    private fileService: FileService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<I_ResolveForkJoin>{

    this.fileService.filesFilter$.next(null);

    this.fileService.foldersFilter$.next(null);

    return new Observable((subsciber) => {

      this.fetchData().subscribe((data) => {

        this.fileService.hydrate(data);

        console.log({data})

        subsciber.next(data);

        subsciber.complete();

      })

    })
  }


  fetchData(): Observable<I_ResolveForkJoin> {
    return forkJoin({
      filesList: this.utilsService.reqDataToObservable<I_File[]>(
        this.apiService.getPaginatedFileList(undefined, undefined, true)
      ),
      folderList: this.utilsService.reqDataToObservable<I_Folder[]>(
        this.apiService.getPaginatedFolderList(undefined, undefined, true)
      ),
    })
  }

}
