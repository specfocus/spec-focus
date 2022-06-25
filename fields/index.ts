import { RegisterOptions } from '../validations/validator';
import type { InternalFieldName } from './names';

export type { FieldArray, FieldArrayWithId } from './arrays';
export type { FieldName, InternalFieldName } from './names';
export type {
  ArrayPath,
  FieldArrayPath,
  FieldArrayPathValue,
  FieldPath,
  FieldPathValue,
  FieldPathValues,
  Path,
  PathValue
} from './paths';
export type { FieldValue, FieldValues } from './values';

export type Field<Ref = any> = {
  _f: {
    ref: Ref;
    name: InternalFieldName;
    refs?: HTMLInputElement[];
    mount?: boolean;
  } & RegisterOptions;
};

export type FieldRefs = Partial<Record<InternalFieldName, Field>>;