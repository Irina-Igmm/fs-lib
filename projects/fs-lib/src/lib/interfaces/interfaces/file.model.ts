export interface I_Storage {
  id: number;
  name: string;
  size?: string | number;
  description?: string;
  // f_type: string;
  // extension?: string | null,
  // f_in?: string | number | null;
  // f_cover?: string | null;
  parent?: string | null | any;
  file_path?: string;
  createdAt?: string;
  updateAt?: string;
  ownerId?: string | number;
  status?: string | boolean;
  // type?: string;
  shared?: boolean;
  arcived?: boolean;
  childrenCount?: number;
}

export interface I_File extends I_Storage {
  extension?: string | null;
  type?: string | null;
  fileSize?: number;
}

export interface I_Folder extends I_Storage {}

// export enum DisplayType {
//         list = "list",
//         List = "list",
//         LIST = "list",
//         grid = "grid",
//         Grid = "grid",
//         GRID = "grid",
// }

export type DisplayType = 'list' | 'grid' | 'List' | 'Grid' | 'LIST' | 'GRID';
export interface I_DisplayMode {
  id: string;
  display_mode: DisplayType;
}


export interface I_UploadedFile {
  file: File;
  fileName: string;
  progress: number;
}
