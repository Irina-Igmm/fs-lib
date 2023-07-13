import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { I_File, I_Folder } from '../../../interfaces/interfaces/file.model';
import { SearchService } from '../../../services/search/search.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { T_Storage } from '../../../interfaces/interfaces';
import { I_StorageFilter } from '../../../interfaces/interfaces/storage-filter';

@Component({
  selector: 'app-search-list-view',
  templateUrl: './search-list-view.component.html',
  styleUrls: ['./search-list-view.component.scss']
})
export class SearchListViewComponent implements OnInit {

  private isLoading: boolean = false;

  @Input() drop: any;

  @Input() storages: any[] = [];

  @Input() folders: I_Folder[] = [];

  @Output() fetchMore = new EventEmitter();

  @Output() dblClick = new EventEmitter();


  loaded: boolean = true;


  @Input() addRecentSection: boolean = true;

  @Input() files: I_File[] = [];

  @Input() recents: I_File[] | I_Folder[] = [];

  @Output() fetchMoreStorage = new EventEmitter();

  @Output() dblClickFolder = new EventEmitter();


  @ViewChild('menu') menu!: ElementRef
  contextmenu(e: any) {
    e.preventDefault();
    this.menu.nativeElement.style.display = 'block'
    this.menu.nativeElement.style.top = e.pageY + 'px';
    this.menu.nativeElement.style.left = e.pageX + 'px';
    console.log(e.pageX);
    console.log('-----------');
    console.log(e.pageY);

  }

  constructor(
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


  private get isAllFoldersListLoaded() {
    return (
      this.searchService.searchPagination$.value.page ==
      (this.searchService.searchPagination$.value.totalPages as number) - 1
    );
  }

  get isLoaded() {
    return this.searchService.isStorageLoading;
  }

  get newFolder() {
    return this.searchService.newFolder.value;
  }

  get checkedStorageList() {
    return this.searchService.storageMultiCheck.subCheck as any;
  }

  checkChange(value: MatCheckboxChange |any, storageId: number) {
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
    this.dblClick.emit(folder);
  }


  onMouseDown(index: number) {

    // this.fileService.mouseDownOnFolder(index, storageType);
    this.searchService.mouseDownOnStorage(index);

  }


  onFetchFolderMore() {

    this.fetchMoreStorage.emit()

  }


  onFetchMoreStorage(){
    this.searchService.searchFilter$.next(
      {
        ...(this.searchService.searchFilter$.value as I_StorageFilter ),
        archived: false,
        pagination: {
          limit: (this.searchService.searchPagination$.value.limit as number),
          page: (this.searchService.searchPagination$.value.page as number) + 1,
        } as I_StorageFilter['pagination'],
      }
    )
  }

}
