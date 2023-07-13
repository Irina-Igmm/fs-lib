import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DisplayType } from '../../../interfaces/interfaces/file.model';
import { FileService } from '../../../services/core/services/file.service';

@Component({
  selector: 'file-view-switcher',
  templateUrl: './view-switcher.component.html',
  styleUrls: ['./view-switcher.component.scss']
})
export class ViewSwitcherComponent implements OnInit {

  listView: boolean = true;

  @Output() switchViewEvent = new EventEmitter<string>();

  constructor(
    private fileService: FileService
  ) { }

  ngOnInit(): void {
  }

  switchView(view: DisplayType) {
    this.listView = !this.listView;
    this.fileService.userDisplayMode$.next(view);
    this.switchViewEvent.emit(view);
  }

}
