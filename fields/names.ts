import type { IsFlatObject } from '../structs/flat';
import type { FieldValues } from './values';

export type InternalFieldName = string;

export type FieldName<TFieldValues extends FieldValues> =
  IsFlatObject<TFieldValues> extends true
    ? Extract<keyof TFieldValues, string>
    : string;