import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  ActivatedRoute
} from '@angular/router';
import { Observable, Subscriber, forkJoin, of } from 'rxjs';
import { I_ResolveForkJoin } from '../../interfaces/interfaces/api.model';
import { I_CustomResolver } from '../../interfaces/interfaces/custom-resolver';
import { I_Storage } from '../../interfaces/interfaces/file.model';
import { ApiService } from '../../services/services/api.service';
import { UtilsService } from '../../services/services/utils.service';
import { SearchService } from '../../services/search/search.service';

@Injectable({
  providedIn: 'root'
})
export class SearchResolver implements Resolve<I_ResolveForkJoin>, I_CustomResolver {

  constructor(
    private utilsService: UtilsService,
    private apiService: ApiService,
    private activatedRoute: ActivatedRoute,
    private searchService: SearchService
  ) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<I_ResolveForkJoin> {

    const queryParams = this.activatedRoute.snapshot.queryParams.text;

    return new Observable((subscriber) => {

      this.fetchData(queryParams).subscribe((data) => {

        this.searchService.hydrate(data);

        subscriber.next(data);

        subscriber.complete();

      })

    });

  }


  fetchData(search: string): Observable<I_ResolveForkJoin> {

    return forkJoin({
      filesList: this.utilsService.reqDataToObservable<I_Storage[]>(
        this.apiService.searchStorage(search)
      )
    })

  }
}
