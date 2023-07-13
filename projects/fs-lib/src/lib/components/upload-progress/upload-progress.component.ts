import { Component, OnInit } from '@angular/core';
import { UploadStoreService } from '../../services/services/upload-store.service';
import { Observable } from 'rxjs';
import { FileService } from '../../services/core/services/file.service';
import { I_FilesUploadFilter, I_FoldersUploadFilter, I_UploadProgress } from '../../interfaces/interfaces/api.model';
import { GeneralService } from '../../services/services/general.service';

@Component({
  selector: 'app-upload-progress',
  templateUrl: './upload-progress.component.html',
  styleUrls: ['./upload-progress.component.scss']
})
export class UploadProgressComponent implements OnInit {

  panelOpenState = false;

  disp = [
    {
        "uniqueId": "b9sfvhivq8hmivz2lwvrs9lilbr9se",
        "file": {},
        "progress": 100,
        "type": "file",
        "path": "Nouveau dossier",
        "status": "finished"
    },
    {
        "uniqueId": "kyxse6s66zgdmsxnp2mvclilbr9sg",
        "file": {},
        "progress": 100,
        "type": "file",
        "path": "Nouveau dossier",
        "status": "failed"
    },
    {
        "uniqueId": "o2etpsxxzfiv4943vb6aylilbr9sg",
        "file": {},
        "progress": 50,
        "type": "file",
        "path": "Nouveau dossier",
        "status": "canceled"
    },
    {
        "uniqueId": "uajfzz1mqhjza7r3iysr2flilbr9sg",
        "file": {},
        "progress": 0,
        "type": "file",
        "path": "Nouveau dossier"
    },
    {
        "uniqueId": "tu0t4gxrpsrfdke0ldbwrlilbr9sg",
        "file": {},
        "progress": 0,
        "type": "file",
        "path": "Nouveau dossier"
    },
    {
        "uniqueId": "ghbnmynejp7lukx2j88s1lilbr9sg",
        "file": {},
        "progress": 0,
        "type": "file",
        "path": "Nouveau dossier"
    },
    {
        "uniqueId": "s5q6mgntfoosxdmjbg8zulilbr9sg",
        "file": {},
        "progress": 2,
        "type": "file",
        "path": "Nouveau dossier"
    }
]

  constructor(
    private uploadStoreService: UploadStoreService,
    private fileService: FileService,
    private generalService: GeneralService
  ) { }

  ngOnInit(): void {
  }


  get filesToUpload() {

    // return this.disp as any
    return this.uploadStoreService.filesToDisplay$
  }


  testSub() {
    this.fileService.testSub();
  }


  onRetry(fileToRetry: I_UploadProgress) {

    let originalDisplayList: I_UploadProgress[] = this.uploadStoreService.filesToDisplay$.value;

    let displayToRetryIndex: number = this.uploadStoreService.filesToDisplay$.value.findIndex(file => file.uniqueId == fileToRetry.uniqueId) as number;


    this.uploadStoreService.filesToDisplay$.value[displayToRetryIndex].progress = 0;
    this.uploadStoreService.filesToDisplay$.value[displayToRetryIndex].status = "in-progress";

    let toBeUploaded: I_FoldersUploadFilter = {
      // folderTree: folderTree,
      parentId: this.fileService.filesFilter$.value?.parentId ?? null,
      // allFiles: event.target?.files,
      activeId: fileToRetry.uniqueId,
      path: fileToRetry.path,
      file: fileToRetry.file as File
    }

    this.generalService.foldersReadyForUpload$.next(toBeUploaded);

  }


  onCancel(fileToCancel: I_UploadProgress) {

    let fileToDisplay = this.uploadStoreService.filesToDisplay$.value;

    let fileTodisplayIndex = this.uploadStoreService.filesToDisplay$.value.findIndex(file => file.uniqueId == fileToCancel.uniqueId);

    fileToDisplay[fileTodisplayIndex].progress == 0;
    fileToDisplay[fileTodisplayIndex].status == "canceled";

    this.uploadStoreService.filesToDisplay$.value[fileTodisplayIndex].status = "canceled"

  }


  get finishedFile() {

    const count = this.filesToUpload.value.filter(element => element.status == "finished").length;

    return count;

  }

}
