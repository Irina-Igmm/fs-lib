import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../lib.env';
import { ApiService } from './services/api.service';
import { GeneralService } from './services/general.service';
import { LetterPaginationService } from './services/letter-pagination.service';
import { StatusService } from './services/status.service';
import { UploadStoreService } from './services/upload-store.service';
import { UsersService } from './services/users.service';
import { UtilsService } from './services/utils.service';
import { MoveService } from './core/services/move.service';
import { FileService } from './core/services/file.service';
import { CopyService } from './core/services/copy.service';
import { SearchService } from './search/search.service';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers : [
    ApiService,
    GeneralService,
    LetterPaginationService,
    StatusService,
    UploadStoreService,
    UsersService,
    UtilsService,
    MoveService,
    FileService,
    CopyService,
    SearchService,
    TokenInterceptor,
    { provide: 'storageUrl', useValue: environment.storageUrl }
  ]
})
export class ServicesModule { }
