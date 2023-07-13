import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { I_Folder } from '../../../interfaces/interfaces/file.model';
import { I_File } from '../../../interfaces/interfaces/file.model';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../../services/services/api.service';
import { MoveService } from '../../../services/core/services/move.service';
import { I_PathPartition } from '../../../interfaces/interfaces/navigation';
import { BreadcrumbComponent } from '../../breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-destination-select',
  templateUrl: './destination-select.component.html',
  styleUrls: ['./destination-select.component.scss']
})
export class DestinationSelectComponent implements OnInit {

  @Input() parentId!: number | string;

  @Input() storageIdsToMove!: number[];

  @Input() fileIdsToMove!: number[];

  @Input() folderIdsToMove!: number[];

  fullPath: any[] | I_PathPartition[] = [];

  files: any[] = [];

  folders: I_Folder[] = [];

  selectedFolderId!: number;

  constructor(
    private activeModal: NgbActiveModal,
    private apiService: ApiService,
    private moveService: MoveService
  ) { }

  ngOnInit(): void {
    this.accessingFolder(null, false, 'access');
    console.log('STORAGE IDS', this.storageIdsToMove);
    console.log('File IDS', this.fileIdsToMove);
    console.log('Folder IDS', this.folderIdsToMove);
  }


  onDblCLick(folder: any): void {
    return;
  }


  onMouseDown(folderId: number) {
    return
  }


  onMove() {

    if (this.selectedFolderId) {

      this.moveService.moveStorages(this.fileIdsToMove, this.folderIdsToMove, this.selectedFolderId as number);

      this.activeModal.close();

    }

  }


  accessingFolder(folder: I_Folder | any, previous: boolean = false, navigationType: 'access' | 'previous' | 'breadcrumb') {

    let selectedFolderId: number[] = [this.selectedFolderId];

    this.apiService.getFoldersByParentId(folder != null ? folder.id : null).subscribe(res => {

      if (res.status) {


        switch (navigationType) {
          case 'previous':
            this.fullPath.pop();
            break;

          case 'access':
            let partitionDetail: I_PathPartition = {
              id: folder?.id as number,
              label: folder?.name as string,
              content: folder
            }

            this.fullPath.push(partitionDetail);
            break;

          case 'breadcrumb':
            let pathToNavigateInIndex = this.fullPath.findIndex(partition => partition.id == folder?.id);
            // console.log('FULL PATH SLICED', this.fullPath.slice(0, pathToNavigateInIndex + 1))
            this.fullPath = this.fullPath.slice(0, pathToNavigateInIndex + 1);
            break;


          default:
            break;
        }

        console.log('FIRST PATH', this.fullPath)

        let originalFolderList: I_Folder[] = res.data.filter((folder: any) => {
          return !this.folderIdsToMove.includes(folder.id as number)
        });

        // this.folders = (res.data);
        this.folders = (originalFolderList);
        console.log('FOLDERS BY PARENT ID', res.data);

      }

    });

  }


  get validSelect() {

    if (this.selectedFolderId) {
      return true;
    }

    return false;

  }


  onFolderCheck(event: number | any) {

    console.log('CHECK VALUE CHANGE', event);


    this.selectedFolderId = event;

  }


  goToPreviousList() {

    console.log('FULL PATH BEFORE PREVIOUS', this.fullPath)

    if (this.fullPath.length <= 1) {

      return;

    } else {

      this.accessingFolder(this.fullPath[this.fullPath.length - 2].content, true, 'previous');

    }


  }


  navigateWithBreadCrumb(event: I_PathPartition) {

    if (
      this.fullPath.length <= 1 ||
      this.fullPath[this.fullPath.length - 1].id == event.id
      ) {

      return;

    } else {

      this.accessingFolder(event.content, false, 'breadcrumb');

    }


  }


  get previousButtonLabel() {

    if (this.fullPath.length <= 1) {

      return "Mon stockage";

    } else {

      return this.fullPath[this.fullPath.length - 1].label;

    }

  }

}
