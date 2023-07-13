import { Component, Input, OnInit } from '@angular/core';
import { I_Folder } from '../../../interfaces/interfaces/file.model';

@Component({
  selector: 'app-search-list-item',
  templateUrl: './search-list-item.component.html',
  styleUrls: ['./search-list-item.component.scss']
})
export class SearchListItemComponent implements OnInit {

  @Input() folder: I_Folder | undefined;

  @Input() storage: any = {};


  constructor() { }

  ngOnInit(): void {
  }

}
