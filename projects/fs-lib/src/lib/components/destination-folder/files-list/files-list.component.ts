import { Component, Input, OnInit } from '@angular/core';
import { I_File } from '../../../interfaces/interfaces/file.model';

@Component({
  selector: 'app-files-list',
  templateUrl: './files-list.component.html',
  styleUrls: ['./files-list.component.scss']
})
export class FilesListComponent implements OnInit {

  @Input() files: I_File[] = [];

  constructor() { }

  ngOnInit(): void {
  }


  onMouseDown(folderId: number) {
    return
  }

}
