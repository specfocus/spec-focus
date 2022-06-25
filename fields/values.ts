import type { InternalFieldName } from './names';

export type FieldValue<TFieldValues extends FieldValues> =
  TFieldValues[InternalFieldName];

export type FieldValues = Record<string, any>;

export type NativeFieldValue = string | number | boolean | null | undefined;