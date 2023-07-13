import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../lib.env';
import { FoldersListComponent } from './destination-folder/folders-list/folders-list.component';
import { SearchGridViewComponent } from './search-features/search-grid-view/search-grid-view.component';
import { SearchListViewComponent } from './search-features/search-list-view/search-list-view.component';
import { SearchGridItemComponent } from './search-items/search-grid-item/search-grid-item.component';
import { SearchListItemComponent } from './search-items/search-list-item/search-list-item.component';
import { SearchPageComponent } from './search-page/search-page.component';
import { HttpClientModule } from '@angular/common/http';
import { GlobalFrameComponent } from './layouts/global-frame/global-frame.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';



@NgModule({
  declarations: [
    FoldersListComponent,
    SearchGridViewComponent,
    SearchListViewComponent,
    SearchGridItemComponent,
    SearchListItemComponent,
    SearchPageComponent,
    GlobalFrameComponent,
    
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    DragDropModule,
    ReactiveFormsModule,
    MatIconModule,
    MatProgressBarModule
  ],
  exports: [
    FoldersListComponent,
    SearchGridViewComponent,
    SearchListViewComponent,
    SearchGridItemComponent,
    SearchListItemComponent,
    SearchPageComponent,
    GlobalFrameComponent
  ],
  providers: [
    { provide: 'storageUrl', useValue: environment.iconsUrl }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class ComponentsModule { }
