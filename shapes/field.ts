import { BooleanType } from '../booleans';
import { DateType } from '../dates/date';
import { ARRAY_TYPE } from '../many/array-field';
import { IntegerType, NumberType } from '../numbers';
import { Shape } from '.';
import { StringType } from '../strings';
import { DICTIONARY, RECORD, RecordType } from './record';

export type PrimitiveNameOf<T> =
  T extends Boolean ? BooleanType
  : T extends Date ? DateType
  : T extends BigInt ? IntegerType
  : T extends Number ? NumberType
  : T extends String ? StringType
  : RecordType;

type FieldsOf<T> = typeof RECORD | [string, typeof RECORD] | FieldMap<T>;

type ArrayOf<U> = U extends Shape
  ?
  | [FieldMap<U> | typeof RECORD, typeof ARRAY_TYPE]
  | [string, typeof RECORD, typeof ARRAY_TYPE]
  : [PrimitiveNameOf<U>, typeof ARRAY_TYPE];

type DictionaryOf<V> = V extends Shape
  ?
  | typeof RECORD
  | [string, typeof RECORD, typeof DICTIONARY, StringType?]
  | [typeof RECORD, typeof DICTIONARY, StringType?]
  | [FieldMap<V>, typeof DICTIONARY, StringType?] // [model name, , , key type]
  : [PrimitiveNameOf<V>, typeof DICTIONARY, StringType?]; // [type, , key type]

// prettier-ignore
export type TypeOf<T> = T extends Array<infer U>
  ? ArrayOf<U>
  : T extends Record<string, infer V>
  ? DictionaryOf<V> // [type, , key type]
  : T extends Shape
  ? FieldsOf<T>
  : PrimitiveNameOf<T>;

export interface FieldModel<T> {
  default?: T;
  name: string;
  type: TypeOf<T>;
}

export type FieldDescriptor<T> = Omit<FieldModel<T>, 'name'>;
export type FieldMap<T extends {}> = {
  [P in keyof T]: FieldDescriptor<T[P]>;
};
