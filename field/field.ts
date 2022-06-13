import { ARRAY } from '../../array';
import { BooleanType } from '../../boolean';
import { DateType } from '../../date';
import { IntegerType, NumberType } from '../../number';
import { SimpleObject } from '../../object';
import { DICTIONARY, RECORD, RecordType } from '../../record';
import { StringType } from '../../string';

export type PrimitiveNameOf<T> =
  T extends Boolean ? BooleanType
  : T extends Date ? DateType
  : T extends BigInt ? IntegerType
  : T extends Number ? NumberType
  : T extends String ? StringType
  : RecordType;

type FieldsOf<T> = typeof RECORD | [string, typeof RECORD] | FieldMap<T>;

type ArrayOf<U> = U extends SimpleObject
  ?
  | [FieldMap<U> | typeof RECORD, typeof ARRAY]
  | [string, typeof RECORD, typeof ARRAY]
  : [PrimitiveNameOf<U>, typeof ARRAY];

type DictionaryOf<V> = V extends SimpleObject
  ?
  | typeof RECORD
  | [string, typeof RECORD, typeof DICTIONARY, StringType?]
  | [typeof RECORD, typeof DICTIONARY, StringType?]
  | [FieldMap<V>, typeof DICTIONARY, StringType?] // [model name, , , key type]
  : [PrimitiveNameOf<V>, typeof DICTIONARY, StringType?]; // [type, , key type]
  
export type TypeOf<T> = T extends Array<infer U>
  ? ArrayOf<U>
  : T extends Record<string, infer V>
  ? DictionaryOf<V> // [type, , key type]
  : T extends SimpleObject
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
