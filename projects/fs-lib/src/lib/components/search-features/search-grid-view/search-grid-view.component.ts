import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { FileService } from '../../../services/core/services/file.service';
import { T_Storage } from '../../../interfaces/interfaces';
import { I_Folder } from '../../../interfaces/interfaces/file.model';
import { SearchService } from '../../../services/search/search.service';
import { I_StorageFilter } from '../../../interfaces/interfaces/storage-filter';

@Component({
  selector: 'app-search-grid-view',
  templateUrl: './search-grid-view.component.html',
  styleUrls: ['./search-grid-view.component.scss']
})
export class SearchGridViewComponent implements OnInit {

  private isLoading: boolean = false;

  @Input() storages: any[] = [];

  @Input() folders: I_Folder[] = [];

  @Input() drop: any;

  @Output() fetchMore = new EventEmitter();

  @Output() dblClick = new EventEmitter();

  @Output() fetchFolderMore = new EventEmitter();

  @Output() fetchFileMore = new EventEmitter();

  @Output() dblClickFolder = new EventEmitter();

  constructor(
    private fileService: FileService,
    private searchService: SearchService
  ) { }

  ngOnInit(): void {
  }


  paginate(e: any) {

    if (this.isAllStorageListLoaded && !this.isLoaded) {
      this.searchService.isStorageLoading = true;

      return this.fetchMore.emit();
    }

  }


  get isAllStorageListLoaded() {
    return (
      this.searchService.searchPagination$.value.page ==
      (this.searchService.searchPagination$.value.totalPages as number)
    );
  }

  get isLoaded() {
    return this.searchService.isStorageLoading;
  }

  get newFolder() {
    return this.fileService.newFolder.value;
  }


  get checkedStorageList() {
    return this.searchService.storageMultiCheck.subCheck as any;
  }

  checkChange(value: MatCheckboxChange | any, storageId: number) {
    this.searchService.storageMultiCheckChange(value, storageId);
  }

  get allComplete() {
    return this.searchService.storageMultiCheck.completed;
  }

  someComplete(): boolean {
    return this.searchService.storageCompleteCheckSome();
  }

  setAll(completed: MatCheckboxChange | any) {

    this.searchService.storageSetCheckAll(completed.checked);

    // this.searchService.storageSetCheckAll(completed);

  }

  onDblCLick(folder: I_Folder){
    this.dblClick.emit(folder)
  }


  onMouseDown(index: number) {

    this.searchService.mouseDownOnStorage(index);

  }

}
