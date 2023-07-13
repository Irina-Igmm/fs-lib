import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { I_FolderTree, I_PaginationRes } from '../../interfaces/interfaces/api.model';

import { I_APIRes, I_Filter } from '../../interfaces/interfaces/api.model';
import { I_Folder } from '../../interfaces/interfaces/file.model';
import { DisplayType, I_Storage } from '../../interfaces/interfaces/file.model';
import { I_StorageFilter } from '../../interfaces/interfaces/storage-filter';
import { I_User } from '../../interfaces/interfaces/user.model';
import api_config from '../../interfaces/configs/api.config.json'


// import { environment } from './../../../environments/environment.prod';
// import { filesMock } from '../mocks/files-mock';
// import { UsersMock } from '../mocks/users-mock';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public url?: string;
  constructor(
    private http: HttpClient,
    @Inject('storageUrl') storageUrl: string
  ) {
    this.url = storageUrl;
  }

  // getUsersMockList = (term: string): Observable<I_APIRes> => {

  //   // return of(UsersMock);
  //   const filteredData = UsersMock.data.filter((data: I_User) => {
  //     return data.email?.includes(term);
  //   });
  //   return of({ data: filteredData, status: UsersMock.status, message: UsersMock.message });
  // }

  // getFilesList(parent_id?: string): Observable<I_APIRes> {
  //   return of(filesMock);
  // }
  getFilesPaginated<T>(parent_id?: string, params?: I_Filter): Observable<T | I_APIRes> {
    // return of(filesMock)
    // return this.http.get<I_APIRes>(`http://localhost:8080/storage`,
    // params: {
    //   page: params?.page,
    //   limit: params?.limit,
    // });
    return this.http.get<T | I_APIRes>(`http://localhost:8080/storage`, {
      params: {
        limit: params?.limit ? params.limit : 5,
        page: params?.page ? params.page : 0,
      }
    });
  }

  getUserDisplayMode(display_id: string | undefined) {
    // if (display_id == "0") {
    //   return DisplayType.GRID;
    // } else {
    //   return DisplayType.LIST;
    // }
  }


  getPaginatedFileList(storageFilter?: I_StorageFilter, parentId?: number | null, archivedList: boolean = false) {

    if (!archivedList) {

      return this.http.post<I_PaginationRes>(
        `${this.url}${api_config.storage.paginatedFilesList}`, parentId ?? null, {
        params: storageFilter?.pagination,
      });

    } else {

      return this.http.post<I_PaginationRes>(
        `${this.url}${api_config.storage.paginatedArchivedFilesList}`, parentId ?? null, {
        params: storageFilter?.pagination,
      });

    }

  }


  getPaginatedFolderList(storageFilter?: I_StorageFilter, parentId?: number | null, archivedList: boolean = false) {

    if (!archivedList) {
      return this.http.post<I_PaginationRes>(
        `${this.url}${api_config.storage.paginatedFoldersList}`, parentId ?? null, {
        params: storageFilter?.pagination,
      });
    } else {
      return this.http.post<I_PaginationRes>(
        `${this.url}${api_config.storage.paginatedArchivedFoldersList}`, parentId ?? null, {
        params: storageFilter?.pagination,
      });
    }

  }

  createFolder(input: Omit<I_Folder, 'id'>, parentId: number | null) {

    // let params = {
    //   folderName: input.name,
    //   parentId: parentId
    // }

    let params = new HttpParams()
      .set('folderName', input.name)
      .set('parentId', parentId?.toString() || "null");

    return this.http.post<I_APIRes>(`${this.url}${api_config.storage.newFolder}`, null,
      {
        params
      }
    );

    // return this.http.post<I_APIRes>(`${this.url}${api_config.storage.newFolder}`,
    // {
    //  ...input
    // });

  }

  deleteStorageElements(elementIds: number[]) {

    return this.http.delete<I_APIRes>(`${this.url}${api_config.storage.deleteStorage}`,
      {
        body: [...elementIds]
      }
    );

  }

  renameStorageElement(id: number, newName: string) {

    return this.http.put<I_APIRes>(
      `${this.url}${api_config.storage.renameFolder}/${id}`,
      null,
      {
        params: {
          newName
        }
      }
    );

  }

  archiveStorageElement(elementIds: number[], archive: boolean) {

    return this.http.put<I_APIRes>(`${this.url}${api_config.storage.archiveStorage}`,
      [...elementIds],
      {
        params: {
          archive
        }
      });

  }

  shareStorageElement(elementIds: number[], share: boolean) {

    return this.http.put<I_APIRes>(`${this.url}${api_config.storage.share}`,
      [...elementIds],
      {
        params: {
          share
        }
      }
    );

  }

  getRecentFile() {

    return this.http.get<I_APIRes>(`${this.url}${api_config.storage.recentFile}`);

  }


  uploadFiles(fileList: FileList | File, parentId: number) {

    const formData = new FormData();
    formData.append("parentId", String(parentId))

    formData.append("files", fileList as File)

    return this.http.post<I_APIRes>(`${this.url}${api_config.storage.uploadFiles}`, formData, {
      reportProgress: true,
      observe: 'events',
    });

  }


  uploadFolders(folderTree: I_FolderTree[] | I_FolderTree) {

    const headers = new HttpHeaders({
      'Content-Type': 'multipart/form-data' // Set the Content-Type header to multipart/form-data
    });

    const options = { headers };

    return this.http.post<I_APIRes>(`${this.url}${api_config.storage.uploadFolders}`, folderTree, {
      reportProgress: true,
      observe: 'events',
      headers: { 'Content-type': 'multipart/form-data' }
    });

  }


  uploadFileFromFolder(fileDetails: { file: File, path: string, parentId: number }) {

    const formData = new FormData();

    formData.append("parentId", String(fileDetails.parentId));
    formData.append("path", String(fileDetails.path));
    formData.append("file", fileDetails.file);


    const httpOptions = {
      headers: new HttpHeaders(),
      reportProgress: true, // Enable progress tracking
      observe: 'events' as any
    };

    // Set the Content-Type header to multipart/form-data
    httpOptions.headers.append('Content-type', 'multipart/form-data');

    return this.http.post<I_APIRes>(`${this.url}${api_config.storage.uploadFolders}`, formData, httpOptions);

    // return this.http.post<I_APIRes>(`${environment.storageUrl}${api_config.storage.uploadFolders}`, formData, {
    //   reportProgress: true,
    //   observe: 'events',
    //   headers: {'Content-Type': 'multipart/form-data'},
    //   params: {
    //     parentId: fileDetails.parentId,
    //     path: fileDetails.path
    //   }

    // });


  }


  downloadStorageElements(elementIds: number[]) {

    const headers = new HttpHeaders({
      'Content-type': 'multipart/form-data' // Set the Content-Type header to multipart/form-data,
    });

    const options = { headers };

    return this.http.post<I_APIRes>(`${this.url}${api_config.storage.downloadStorage}`,
      // {
      [...elementIds],
      options
      // }
    );

  }


  searchStorage(search: string, storageFilter?: I_StorageFilter) {

    // return this.http.get<I_PaginationRes>(`${this.url}${api_config.storage.searchStorage}`, {
    //   params: {
    //     search: search
    //   }
    // })

    return of({
      data: {
        "content": [
          {
            "id": 231,
            "name": "Comment bien travailler les abdos à la barre 3 exercices efficaces pour débuter.mp4",
            "description": null,
            "parent": null,
            "ownerId": null,
            "archived": false,
            "shared": false,
            "status": null,
            "sharing_status": null,
            "file_path": "/Upload",
            "createdAt": "2023-05-18T12:07:58.538638",
            "updateAt": "2023-05-18T12:07:58.552968",
            "consultedAt": "2023-05-18T12:07:58.552968",
            "extension": null,
            "type": null,
            "fileSize": 18140161
          },
          {
            "id": 230,
            "name": "ANGRA  Carry On.mp4",
            "description": null,
            "parent": null,
            "ownerId": null,
            "archived": false,
            "shared": false,
            "status": null,
            "sharing_status": null,
            "file_path": "/Upload",
            "createdAt": "2023-05-12T12:13:18.56122",
            "updateAt": "2023-05-12T12:13:18.56122",
            "consultedAt": "2023-05-12T12:13:18.56122",
            "extension": null,
            "type": null,
            "fileSize": 99224488
          },
          {
            "id": 226,
            "name": "y2mate.com - Céline Dion The Power of Love Taking Chances World Tour The Concert_1080p.mp4",
            "description": null,
            "parent": null,
            "ownerId": null,
            "archived": false,
            "shared": false,
            "status": null,
            "sharing_status": null,
            "file_path": "/Upload",
            "createdAt": "2023-05-12T10:41:59.512397",
            "updateAt": "2023-05-12T10:41:59.512397",
            "consultedAt": "2023-05-12T10:41:59.512397",
            "extension": null,
            "type": null,
            "fileSize": 111397065
          },
          {
            "id": 224,
            "name": "aaa.mp4",
            "description": null,
            "parent": null,
            "ownerId": null,
            "archived": false,
            "shared": false,
            "status": null,
            "sharing_status": null,
            "file_path": "/Upload",
            "createdAt": "2023-05-12T10:39:20.210917",
            "updateAt": "2023-05-12T10:39:20.210917",
            "consultedAt": "2023-05-12T10:39:20.210917",
            "extension": null,
            "type": null,
            "fileSize": 3054464
          },
          {
            "id": 223,
            "name": "KAMELOT  Phantom Divine Shadow Empire ft Lauren Hart Official Live Video  Napalm Records.mp4",
            "description": null,
            "parent": null,
            "ownerId": null,
            "archived": false,
            "shared": false,
            "status": null,
            "sharing_status": null,
            "file_path": "/Upload",
            "createdAt": "2023-05-12T10:36:59.737806",
            "updateAt": "2023-05-12T10:36:59.737806",
            "consultedAt": "2023-05-12T10:36:59.737806",
            "extension": null,
            "type": null,
            "fileSize": 125852587
          },
          {
            "id": 221,
            "name": "y2mate.com - Misy tànana mitsotra_360p.mp4",
            "description": null,
            "parent": null,
            "ownerId": null,
            "archived": false,
            "shared": false,
            "status": null,
            "sharing_status": null,
            "file_path": "/Upload",
            "createdAt": "2023-05-12T09:34:33.146296",
            "updateAt": "2023-05-12T09:34:33.146296",
            "consultedAt": "2023-05-12T09:34:33.146296",
            "extension": null,
            "type": null,
            "fileSize": 10588518
          },
          {
            "id": 220,
            "name": "A Week Away  Place In This World  Kevin Quinn  Bailee Madison  Netflix_1080p.mkv",
            "description": null,
            "parent": null,
            "ownerId": null,
            "archived": false,
            "shared": false,
            "status": null,
            "sharing_status": null,
            "file_path": "/Upload",
            "createdAt": "2023-05-12T09:16:22.232881",
            "updateAt": "2023-05-12T09:16:22.232881",
            "consultedAt": "2023-05-12T09:16:22.232881",
            "extension": null,
            "type": null,
            "fileSize": 50634025
          },
          {
            "id": 219,
            "name": "A Week Away  Place In This World  Kevin Quinn  Bailee Madison  Netflix.mp4",
            "description": null,
            "parent": null,
            "ownerId": null,
            "archived": false,
            "shared": false,
            "status": null,
            "sharing_status": null,
            "file_path": "/Upload",
            "createdAt": "2023-05-12T09:16:19.653434",
            "updateAt": "2023-05-12T09:16:19.653434",
            "consultedAt": "2023-05-12T09:16:19.653434",
            "extension": null,
            "type": null,
            "fileSize": 180095912
          },
          {
            "id": 218,
            "name": "55579307_2263421790593882_127907952890740736_n - Copie.mp4",
            "description": null,
            "parent": null,
            "ownerId": null,
            "archived": false,
            "shared": false,
            "status": null,
            "sharing_status": null,
            "file_path": "/Upload",
            "createdAt": "2023-05-12T09:15:48.174424",
            "updateAt": "2023-05-12T09:15:48.174424",
            "consultedAt": "2023-05-12T09:15:48.174424",
            "extension": null,
            "type": null,
            "fileSize": 3054464
          }
        ],
        "pageable": {
          "sort": {
            "empty": false,
            "sorted": true,
            "unsorted": false
          },
          "offset": 0,
          "pageNumber": 0,
          "pageSize": 10,
          "unpaged": false,
          "paged": true
        },
        "totalElements": 9,
        "totalPages": 1,
        "last": true,
        "size": 10,
        "number": 0,
        "sort": {
          "empty": false,
          "sorted": true,
          "unsorted": false
        },
        "numberOfElements": 9,
        "first": true,
        "empty": false
      },
      status: true,
      message: "list"
    })

  }


  getFoldersByParentId(parentId: number | null) {

    return this.http.post<I_APIRes>(
      `${this.url}${api_config.storage.foldersListByParentId}`, parentId ?? null
    );

  }


  getFilesByParentId(parentId: number | null) {

    return this.http.post<I_APIRes>(
      `${this.url}${api_config.storage.foldersListByParentId}`, parentId ?? null
    );

  }


  moveStorage(storageIds: number[], parentId: number) {

    return this.http.put<I_APIRes>(
      `${this.url}${api_config.storage.moveStorage}/${parentId}`, storageIds, {
      params: {
        parentId: parentId
      }
    })


  }


  copyFiles(storageIds: number[], parentId: number | null) {

    return this.http.put<I_APIRes>(
      `${this.url}${api_config.storage.copyFiles}`, storageIds, {
      params: {
        parentId: parentId ?? "null"
      }
    })


  }


  getPaginatedSharedFileList(storageFilter?: I_StorageFilter, parentId?: number | null) {

    return this.http.post<I_PaginationRes>(
      `${this.url}${api_config.storage.paginatedSharedFilesList}`, parentId ?? null, {
      params: storageFilter?.pagination,
    });

  }


  getPaginatedSharedFolderList(storageFilter?: I_StorageFilter, parentId?: number | null) {

    return this.http.post<I_PaginationRes>(
      `${this.url}${api_config.storage.paginatedSharedFoldersList}`, parentId ?? null, {
      params: storageFilter?.pagination,
    });
  }

}
