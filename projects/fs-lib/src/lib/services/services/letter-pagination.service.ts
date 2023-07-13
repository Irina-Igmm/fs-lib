import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class LetterPaginationService {

  constructor(private apiService: ApiService) {

  }
}
