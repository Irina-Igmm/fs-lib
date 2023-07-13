import { Component, Input, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatListItem } from '@angular/material/list';
import { I_File } from '../../../interfaces/interfaces/file.model';

@Component({
  selector: 'app-file-list-item',
  templateUrl: './file-list-item.component.html',
  styleUrls: ['./file-list-item.component.scss']
})
export class FileListItemComponent implements OnInit {

  @Input() file: I_File | undefined;

  constructor(
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
  }

}
