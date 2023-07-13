import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { I_File, I_Folder } from '../../../interfaces/interfaces/file.model';

@Component({
  selector: 'app-search-grid-item',
  templateUrl: './search-grid-item.component.html',
  styleUrls: ['./search-grid-item.component.scss']
})
export class SearchGridItemComponent implements OnInit {

  @Output() fetchFolderMore = new EventEmitter();

  @Output() fetchFileMore = new EventEmitter();

  @Input() storage: any = {};

  @Output() dblClickFolder = new EventEmitter();


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
