import { NgModule } from '@angular/core';
import { FsLibComponent } from './fs-lib.component';
import { ComponentsModule, DirectivesModule, FilesModulesModule, ResolversModule, ServicesModule, SharedModule, SharedPipesModule } from '../public-api';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
// import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';




@NgModule({
  declarations: [
    FsLibComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    DirectivesModule,
    FilesModulesModule,
    ServicesModule,
    ResolversModule,
    SharedPipesModule,
    SharedModule,
    ReactiveFormsModule,
    MatIconModule,
    MatInputModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatListModule,
    // NgbActiveModal,
    HttpClientModule,
    MatProgressBarModule,
    NgCircleProgressModule,
    MatDialogModule,
  ],
  exports: [
    FsLibComponent
  ]
})
export class FsLibModule { }
