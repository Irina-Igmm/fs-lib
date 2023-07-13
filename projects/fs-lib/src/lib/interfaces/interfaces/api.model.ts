import { I_Folder } from "./file.model";

import { Observable } from "rxjs";

import { I_File } from "./file.model";
import { I_StorageFilter } from "./storage-filter";
import { T_APIStatus, T_Storage } from '.';

export interface I_APIRes {
    data: any;
    status: boolean | T_APIStatus;
    message: string;

}

export interface I_Filter {
    param?: any;
    limit?: any;
    page?: any;
    totalRows?: any;
    column?: any;
    value?: any;
    dateDebut?: any;
    dateDeb?: any;
    dateFin?: any;
    etatDateDebutFin?: boolean;
    statusAffilie?: string;
    entiteId?: any;
    category?: any;
}


export interface I_PaginationRes extends I_APIRes {
    data: {
        content: any[];
        pageable?: {
          sort: {
            empty: boolean;
            sorted: boolean;
            unsorted: boolean
          };
          offset: number;
          pageNumber: number;
          pageSize: number;
          paged: number;
          unpaged: number;
        };
        last?: boolean;
        totalPages?: number;
        totalElements?: number;
        size?: number;
        number?: number;
        sort?: {
          empty: boolean;
          sorted: boolean;
          unsorted: boolean
        };
        first?: boolean;
        numberOfElements?: number;
        empty?: boolean;
    };
    status: boolean;
    message: string;
}


export interface I_ResolveForkJoin {
  filesList?: Observable<I_File[]> | I_File[];
  folderList?: Observable<I_File> | I_File[];
  recentList?: Observable<I_File[] | I_Folder[]> | I_File[] | I_Folder[];
}


export interface I_FileFilter extends I_StorageFilter {
}


export interface I_FolderFilter extends I_StorageFilter {
}

export interface I_FilesUploadFilter {
  files: File | FileList;
  parentId: number | null;
  allFiles?: FileList;
  activeId?: string;
}


export interface I_UploadProgress {
  type?: T_Storage;
  uniqueId: string;
  file: File | I_StaticFolder;
  progress: number;
  id?: number;
  extension?: string;
  path?: string;
  status: 'waiting' | 'in-progress' | 'canceled' | 'finished' | 'failed';
}


export interface I_StaticFolder {
  name: string;
  type?: string | null;
}


export interface I_FolderUploadProgress {

}


export interface I_FolderTree {
  name: string;
  type: T_Storage;
  children: I_FolderTree[];
  data?: File;
  count?: number
}


export interface I_FoldersUploadFilter {
  folderTree?: I_FolderTree[];
  parentId: number | null;
  allFiles?: FileList;
  activeId?: string;
  path?: string;
  file: File;
}


export interface I_FilesUploadFilter {
  files: File | FileList;
  parentId: number | null;
  allFiles?: FileList;
  activeId?: string;
}
