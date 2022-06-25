import { BooleanType } from '../booleans';
import { NumberType } from '../numbers/number';
import { RecordType } from '../shapes/record';
import { StringType } from '../strings';

export const ARRAY_TYPE = 'array';
export type ArrayType = typeof ARRAY_TYPE;

export type ArrayField =
  | [ArrayField | BooleanType | NumberType | StringType, typeof ARRAY_TYPE]
  | [string, RecordType, typeof ARRAY_TYPE];
