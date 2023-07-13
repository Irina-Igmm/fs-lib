import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { I_FilesUploadFilter, I_FolderTree, I_FoldersUploadFilter } from '../../interfaces/interfaces/api.model';
import { Clipboard } from '@angular/cdk/clipboard';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  filesReadyForUpload$ = new BehaviorSubject<I_FilesUploadFilter | null>(null);

  foldersReadyForUpload$ = new BehaviorSubject<I_FoldersUploadFilter | null>(null);

  foldersReadyForTest$ = new BehaviorSubject<I_FoldersUploadFilter | null>(null);

  constructor(
    private clipBoard: Clipboard
  ) { }


  copyToClipboard(type: "storage" | "other", toBeCopied: string) {

    const contentToCopy = toBeCopied;
    this.clipBoard.copy(contentToCopy);

  }

}
