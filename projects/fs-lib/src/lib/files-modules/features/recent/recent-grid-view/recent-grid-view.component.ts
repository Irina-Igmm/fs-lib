import { Component, Input, OnInit } from '@angular/core';

import { I_File, I_Folder } from '../../../../interfaces/interfaces/file.model';

@Component({
  selector: 'app-recent-grid-view',
  templateUrl: './recent-grid-view.component.html',
  styleUrls: ['./recent-grid-view.component.scss']
})
export class RecentGridViewComponent implements OnInit {
  private isLoading: boolean = false;

  @Input() recents: I_File[] |  I_Folder[]  = [];

  @Input() drop: any;

  constructor() { }

  ngOnInit(): void {
  }

}
