import type { IsAny } from '../anything/any';
import type { NonUndefined } from '../maybe/undefined';
import type { NestedValue } from '../values/nested';
import type { File, FileList } from '../files';

export type DeepMap<T, TValue> = IsAny<T> extends true
  ? any
  : T extends Date | FileList | File | NestedValue
  ? TValue
  : T extends object
  ? { [K in keyof T]: DeepMap<NonUndefined<T[K]>, TValue> }
  : TValue;