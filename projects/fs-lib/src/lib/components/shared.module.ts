
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { InjectionToken, NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialog  } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ContextMenuDirective } from '../directives/directives/context-menu.directive';
import { DoubleClickDirective } from '../directives/directives/double-click.directive';
import { ButtonsComponent } from './buttons/buttons.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { ContextMenuComponent } from './context-menu/context-menu.component';
import { LetterPaginationComponent } from './letter-pagination/letter-pagination.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { SkeletonComponent } from './skeleton/skeleton.component';
import { UserInputChipsComponent } from './user-input-chips/user-input-chips.component';
import { UserSelectorDialogComponent, UserSelectorWindow } from './user-selector-dialog/user-selector-dialog.component';
import { UploadProgressComponent } from './upload-progress/upload-progress.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { DropDirective } from '../directives/directives/drop/drop.directive';
import { StorageItemComponent } from './items/storage-item/storage-item.component';
import { CustomDatePipe } from '../shared-pipes/pipes/custom-date/custom-date.pipe';
import { DestinationSelectComponent } from './destination-folder/destination-select/destination-select.component';
import { FilesListComponent } from './destination-folder/files-list/files-list.component';
import { FolderItemComponent } from './destination-folder/items/folder-item/folder-item.component';
import { FileItemComponent } from './destination-folder/items/file-item/file-item.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListItem, MatListModule } from '@angular/material/list';
import {MatRadioModule} from '@angular/material/radio';
import { CustomCircleProgressComponent } from './custom-circle-progress/custom-circle-progress.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { ToastrModule } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../lib.env';


// import { CustomDatePipe } from './pipes/custom-date.pipe';
// import { AccordionModule } from 'ngx-bootstrap/accordion';
// import { MatExpansionModule } from '@angular/material/expansion';
// import {CdkAccordionModule} from '@angular/cdk/accordion';

export const STORAGE_URL = new InjectionToken<string>('storageUrl');


@NgModule({
  
  declarations: [
    // DragDropZoneComponent,
    // DragNDropDirective,
    UserSelectorDialogComponent,
    UserSelectorWindow,
    UserInputChipsComponent,
    ButtonsComponent,
    ProgressBarComponent,
    SkeletonComponent,
    LetterPaginationComponent,
    ContextMenuComponent,
    ContextMenuDirective,
    ConfirmationDialogComponent,
    DoubleClickDirective,
    UploadProgressComponent,
    DropDirective,
    StorageItemComponent,
    CustomDatePipe,
    DestinationSelectComponent,
    FilesListComponent,
    FolderItemComponent,
    FileItemComponent,
    CustomCircleProgressComponent,
    BreadcrumbComponent,
    // LeftSidebarComponent
  ],
  imports: [
    // BrowserModule,
    CommonModule,
    MatProgressBarModule,
    NgCircleProgressModule,
    DragDropModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatListModule ,
    NgCircleProgressModule.forRoot({
      radius: 100,
      outerStrokeWidth: 4,
      innerStrokeWidth: 2,
      outerStrokeColor: "#78C000",
      innerStrokeColor: "#C7E596",
      animationDuration: 300,
    }),
    MatCheckboxModule,
    MatListModule,
    MatRadioModule,
    ClipboardModule,
    ToastrModule.forRoot(
      {
          closeButton: true,
          newestOnTop: true,
          progressBar: true,
          timeOut: 5000,
          positionClass: 'toast-top-right',
      }
  ),
    // CdkAccordionModule,
    // MatExpansionModule
    // AccordionModule
    // NgbModule,

  ],
  exports: [
    CommonModule,
    MatListModule,
    ContextMenuDirective,
    UserSelectorDialogComponent,
    UserInputChipsComponent,
    ProgressBarComponent,
    SkeletonComponent,
    LetterPaginationComponent,
    ContextMenuComponent,
    MatDialogModule,
    ReactiveFormsModule,
    DoubleClickDirective,
    UploadProgressComponent,
    DropDirective,
    FolderItemComponent,
    ButtonsComponent,
    StorageItemComponent,
    CustomDatePipe,
    ConfirmationDialogComponent,
    BreadcrumbComponent,
    CustomCircleProgressComponent,
    DestinationSelectComponent,
    FilesListComponent,
    FileItemComponent,
    MatRadioModule,
    ClipboardModule,
    MatProgressBarModule,
    MatAutocompleteModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatListModule ,
    // LeftSidebarComponent

  ],
  providers : [NgbActiveModal, FormBuilder, MatDialog,
    { provide: 'storageUrl', useValue: environment.iconsUrl } ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA
  ],
})
export class SharedModule { }
