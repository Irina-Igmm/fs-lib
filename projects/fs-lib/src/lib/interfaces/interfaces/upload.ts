export interface Upload {
}


export type T_Writeable<T> = { -readonly [P in keyof T]: T[P] };
