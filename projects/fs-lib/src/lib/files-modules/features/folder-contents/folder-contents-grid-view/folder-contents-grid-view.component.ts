import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { I_File, I_Folder } from '../../../../interfaces/interfaces/file.model';
import { FolderGridViewComponent } from '../../folder/folder-grid-view/folder-grid-view.component';
import { FileGridViewComponent } from '../../file/file-grid-view/file-grid-view.component';


@Component({
  selector: 'app-folder-contents-grid-view',
  templateUrl: './folder-contents-grid-view.component.html',
  styleUrls: ['./folder-contents-grid-view.component.scss']
})
export class FolderContentsGridViewComponent implements OnInit {

  @Input() files: I_File[] = [];

  @Input() folders: I_Folder[] = [];

  @Input() addRecentSection: boolean = true;

  @Input() recents: I_File[] | I_Folder[] = [];

  @Input() drop: any;

  @Output() fetchFolderMore = new EventEmitter();

  @Output() fetchFileMore = new EventEmitter();

  @Output() dblClickFolder = new EventEmitter();


  isFullListDisplayed: boolean = false;

  public subscription: Subscription = new Subscription();

  constructor() { }

  ngOnInit(): void {
  }


  onFetchFolderMore() {

    this.fetchFolderMore.emit()

  }

  onFetchFileMore() {

    this.fetchFileMore.emit()

  }

  onDblClick(folder: I_Folder){

    this.dblClickFolder.emit(folder);

  }

}
