import { Component, Input, OnInit } from '@angular/core';
import { I_Folder } from '../../../../interfaces/interfaces/file.model';

@Component({
  selector: 'app-folder-item',
  templateUrl: './folder-item.component.html',
  styleUrls: ['./folder-item.component.scss']
})
export class FolderItemComponent implements OnInit {

  @Input() folder: I_Folder | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}
