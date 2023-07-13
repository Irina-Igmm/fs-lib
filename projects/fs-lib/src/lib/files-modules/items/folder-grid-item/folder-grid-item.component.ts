import { Component, Input, OnInit } from '@angular/core';
import { I_File } from '../../../interfaces/interfaces/file.model';

@Component({
  selector: 'app-folder-grid-item',
  templateUrl: './folder-grid-item.component.html',
  styleUrls: ['./folder-grid-item.component.scss']
})
export class FolderGridItemComponent implements OnInit {

  @Input() file: I_File = {} as I_File;

  constructor() { }

  ngOnInit(): void {
  }

}
