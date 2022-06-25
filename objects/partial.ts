import type { File, FileList } from '../files';
import type { NestedValue } from '../values/nested';

export declare type DeepPartial<T> = T extends Date | FileList | File | NestedValue
  ? T
  : { [K in keyof T]?: DeepPartial<T[K]> };

export declare type DeepPartialSkipArrayKey<T> = T extends
  | Date
  | FileList
  | File
  | NestedValue
  ? T
  : T extends ReadonlyArray<any>
  ? { [K in keyof T]: DeepPartialSkipArrayKey<T[K]> }
  : { [K in keyof T]?: DeepPartialSkipArrayKey<T[K]> };

export declare type OptionalKeys<T extends {}> = {
  [k in keyof T]: undefined extends T[k] ? k : never;
}[keyof T];

export declare type RequiredKeys<T extends object> = Exclude<keyof T, OptionalKeys<T>>;

export declare type MakePartial<T extends object> = {
  [k in OptionalKeys<T>]?: T[k];
} & {
  [k in RequiredKeys<T>]: T[k]
};
