import { FileSizePipe } from './../shared-pipes/pipes/file-size/file-size.pipe';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { FolderContentsPageComponent } from './pages/folder-contents-page/folder-contents-page.component';
import { MyArchiveListComponent } from './pages/my-archive-list/my-archive-list.component';
import { MyFilesListComponent } from './pages/my-files-list/my-files-list.component';
import { MySharedListPageComponent } from './pages/my-shared-list-page/my-shared-list-page.component';
import { QuotaComponent } from './pages/quota/quota.component';
import { CreateFolderComponent } from './features/dialog/create-folder/create-folder.component';
import { RenameComponent } from './features/dialog/rename/rename.component';
import { FileGridViewComponent } from './features/file/file-grid-view/file-grid-view.component';
import { FileListViewComponent } from './features/file/file-list-view/file-list-view.component';
import { FolderGridViewComponent } from './features/folder/folder-grid-view/folder-grid-view.component';
import { FolderListViewComponent } from './features/folder/folder-list-view/folder-list-view.component';
import { FolderContentsGridViewComponent } from './features/folder-contents/folder-contents-grid-view/folder-contents-grid-view.component';
import { FolderContentsListViewComponent } from './features/folder-contents/folder-contents-list-view/folder-contents-list-view.component';
import { UploadModalComponent } from './features/modals/upload-modal/upload-modal.component';
import { GridViewComponent } from './features/myFiles-features/grid-view/grid-view.component';
import { ListViewComponent } from './features/myFiles-features/list-view/list-view.component';
import { RecentGridViewComponent } from './features/recent/recent-grid-view/recent-grid-view.component';
import { RecentListViewComponent } from './features/recent/recent-list-view/recent-list-view.component';
import { FileGridItemComponent } from './items/file-grid-item/file-grid-item.component';
import { FileListItemComponent } from './items/file-list-item/file-list-item.component';
import { FolderGridItemComponent } from './items/folder-grid-item/folder-grid-item.component';
import { FolderListItemComponent } from './items/folder-list-item/folder-list-item.component';
import { ReactiveFormsModule } from '@angular/forms';
import { InfiniteScrollModule  } from 'ngx-infinite-scroll';
import { NgbNavModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { ViewSwitcherComponent } from './components/view-switcher/view-switcher.component';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
  declarations: [
    FolderContentsPageComponent,
    MyArchiveListComponent,
    MyFilesListComponent,
    MySharedListPageComponent,
    QuotaComponent,
    CreateFolderComponent,
    RenameComponent,
    FileGridViewComponent,
    FileListViewComponent,
    FolderGridViewComponent,
    FolderListViewComponent,
    FolderContentsGridViewComponent,
    FolderContentsListViewComponent,
    UploadModalComponent,
    GridViewComponent,
    ListViewComponent,
    RecentGridViewComponent,
    RecentListViewComponent,
    FileGridItemComponent,
    FileListItemComponent,
    FolderGridItemComponent,
    FolderListItemComponent,
    FileSizePipe,
    ViewSwitcherComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatListModule,
    InfiniteScrollModule,
    NgbNavModule,
    HttpClientModule,
    MatIconModule
  ],
  exports : [
    FolderContentsPageComponent,
    MyArchiveListComponent,
    MyFilesListComponent,
    MySharedListPageComponent,
    QuotaComponent,
    CreateFolderComponent,
    RenameComponent,
    FileGridViewComponent,
    FileListViewComponent,
    FolderGridViewComponent,
    FolderListViewComponent,
    FolderContentsGridViewComponent,
    FolderContentsListViewComponent,
    UploadModalComponent,
    GridViewComponent,
    ListViewComponent,
    RecentGridViewComponent,
    RecentListViewComponent,
    FileGridItemComponent,
    FileListItemComponent,
    FolderGridItemComponent,
    FolderListItemComponent,
    FileSizePipe,
    ViewSwitcherComponent,
    HttpClientModule
  ],
  providers : [DatePipe, NgbActiveModal],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class FilesModulesModule { }
