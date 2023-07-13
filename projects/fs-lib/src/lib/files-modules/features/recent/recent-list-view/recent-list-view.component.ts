import { Component, Input, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';

import { I_File, I_Folder } from '../../../../interfaces/interfaces/file.model';

import { FileService } from 'projects/fs-lib/src/lib/services/core/services/file.service';

@Component({
  selector: 'app-recent-list-view',
  templateUrl: './recent-list-view.component.html',
  styleUrls: ['./recent-list-view.component.scss']
})
export class RecentListViewComponent implements OnInit {
  private isLoading: boolean = false;

  @Input() recents: I_File[] |  I_Folder[]  = [];

  @Input() drop: any;

  constructor(private fileService: FileService) { }

  ngOnInit(): void {
  }

  // get checkedFileList() {
  //   return this.fileService.multiCheck['file'].subCheck as any;
  // }

  // checkChange(value: MatCheckboxChange, fileId: number) {
  //   this.fileService.multiCheckChange(value, fileId, 'file');
  // }

  // get allComplete() {
  //   return this.fileService.multiCheck['file'].completed;
  // }

  // someComplete(): boolean {
  //   return this.fileService.completeCheckSome('file');
  // }

  // setAll(complented: boolean) {
  //   this.fileService.setCheckAll(complented, 'file');
  // }

}
