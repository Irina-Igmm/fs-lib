import { I_ResolveForkJoin } from "./api.model";


export interface I_CustomService {
  hydrate(data: I_ResolveForkJoin): void
}
