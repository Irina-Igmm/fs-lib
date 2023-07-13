import { Component, Input, OnInit } from '@angular/core';
import { I_File } from '../../../../interfaces/interfaces/file.model';

@Component({
  selector: 'app-file-item',
  templateUrl: './file-item.component.html',
  styleUrls: ['./file-item.component.scss']
})
export class FileItemComponent implements OnInit {

  @Input() file: I_File | undefined = undefined

  constructor() { }

  ngOnInit(): void {
  }

}
