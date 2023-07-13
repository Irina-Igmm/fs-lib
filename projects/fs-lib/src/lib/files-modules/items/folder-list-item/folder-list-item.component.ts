import { Component, Input, OnInit } from '@angular/core';
import { I_Folder } from '../../../interfaces/interfaces/file.model';
import { MatListItem } from '@angular/material/list';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-folder-list-item',
  templateUrl: './folder-list-item.component.html',
  styleUrls: ['./folder-list-item.component.scss']
})
export class FolderListItemComponent implements OnInit {

  @Input() folder: I_Folder | any;


  constructor(
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
  }

}
