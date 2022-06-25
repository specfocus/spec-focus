import type { FileList } from '../files';
import type { NestedValue } from '../values/nested';

export type IsFlatObject<T extends object> = Extract<
  Exclude<T[keyof T], NestedValue | Date | FileList>,
  any[] | object
> extends never
  ? true
  : false;