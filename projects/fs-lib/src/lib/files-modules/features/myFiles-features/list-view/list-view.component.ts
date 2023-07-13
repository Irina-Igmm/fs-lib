import { Component, Input, OnInit, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';

import { I_File, I_Folder } from '../../../../interfaces/interfaces/file.model';



@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.scss']
})
export class ListViewComponent implements OnInit {

  loaded: boolean = true;

  @Input() folders: I_Folder[] = [];

  @Input() addRecentSection: boolean = true;

  @Input() files: I_File[] = [];

  @Input() recents: I_File[] | I_Folder[] = [];

  @Input() drop: any;

  @Output() fetchFolderMore = new EventEmitter();

  @Output() fetchFileMore = new EventEmitter();

  @Output() dblClickFolder = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }


  @ViewChild('menu') menu!: ElementRef
  contextmenu(e: any) {
    e.preventDefault();
    this.menu.nativeElement.style.display = 'block'
    this.menu.nativeElement.style.top = e.pageY + 'px';
    this.menu.nativeElement.style.left = e.pageX + 'px';
    console.log(e.pageX);
    console.log('-----------');
    console.log(e.pageY);

  }

  disappearContext() {
    this.menu.nativeElement.style.display = 'none'
  }

  stopPropagation(e: any) {
    e.stopPropagation();
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
