import { Component, Input, OnInit, Output, EventEmitter, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
// import EventEmitter from 'events';
import { I_Folder } from '../../../interfaces/interfaces/file.model';

@Component({
  selector: 'app-folders-list',
  templateUrl: './folders-list.component.html',
  styleUrls: ['./folders-list.component.scss']
})
export class FoldersListComponent implements OnInit {

  @Input() folders: I_Folder[] = [];

  folderForm!: FormGroup;

  folderControl = new FormControl();

  @Output() dblClick = new EventEmitter();

  @Output() valueChange = new EventEmitter();

  currentCheckedValue = null;

  constructor(
    private formBuilder: FormBuilder,
    private renderer: Renderer2
  ) {
    this.folderControl.valueChanges.subscribe(res => {
      // console.log('CHECK VALUE CHANGE', res);
      this.valueChange.emit(res);
    })
  }

  ngOnInit(): void {
  }


  onMouseDown(folderId: number) {
    return
  }


  fetchContents(folder: I_Folder) {
    this.dblClick.emit(folder);
  }


  checkState(event: any) {
    setTimeout(() => {
      if (this.currentCheckedValue && this.currentCheckedValue === event.value) {
        event.checked = false;
        this.renderer.removeClass(event['_elementRef'].nativeElement, 'cdk-focused');
        this.renderer.removeClass(event['_elementRef'].nativeElement, 'cdk-program-focused');
        this.currentCheckedValue = null;
        this.folderControl.patchValue(undefined);
        // this.favoriteSeason = null;
      } else {
        this.currentCheckedValue = event.value
      }
    })
  }

}
