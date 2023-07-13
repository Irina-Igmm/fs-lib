import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FolderContentsResolver } from './resolvers/folder-contents.resolver';
import { StorageArchivedListResolver } from './resolvers/storage-archived-list.resolver';
import { StorageListResolver } from './resolvers/storage-list.resolver';
import { StorageSharedListResolver } from './resolvers/storage-shared-list.resolver';
import { SearchResolver } from './resolvers/search.resolver';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers : [
    FolderContentsResolver,
    StorageArchivedListResolver,
    StorageListResolver,
    StorageSharedListResolver,
    SearchResolver
  ]
})
export class ResolversModule { }
