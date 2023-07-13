import { Observable } from 'rxjs';
import { I_ResolveForkJoin } from './api.model';

export interface I_CustomResolver {
  fetchData([a]: any): Observable<I_ResolveForkJoin>
}
