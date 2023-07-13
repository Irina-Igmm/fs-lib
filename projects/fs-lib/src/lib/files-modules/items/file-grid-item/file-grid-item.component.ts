import { Component, Input, OnInit } from '@angular/core';
import { I_File } from '../../../interfaces/interfaces/file.model';

@Component({
  selector: 'app-file-grid-item',
  templateUrl: './file-grid-item.component.html',
  styleUrls: ['./file-grid-item.component.scss']
})
export class FileGridItemComponent implements OnInit {

  @Input() file: I_File = {} as I_File;

  constructor() { }

  ngOnInit(): void {
  }

}
