import { T_Storage } from ".";

export interface StorageFilter {
}

export interface I_StorageFilter {
  archived?: boolean,
  parentId?: number | null;
  pagination?: {
    page: number,
    limit: number
  };
  storageType: T_Storage;
  search?: string | null;
}
