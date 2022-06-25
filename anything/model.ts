import { Reference } from '../references';

export type AbsoluteUrl = string;
export type Base64 = string;
export type Base64Url = string;
export type Code = string;
export type EmailAddress = string;
export type Guid = string;
export type LowerCase = string;
export type Json = Code;
export type NumberLike = string;
export type PhoneNumber = string;
export type UpperCase = string;
declare type Weekday = Date;
declare type Weekend = Date;

export const BOOLEAN = 'boolean';
export const DATE = 'date';
export const DATE_TIME = 'datetime';
export const DECIMAL = 'decimal';
export const DOUBLE = 'double';
export const INTEGER = 'integer';
export const NUMBER = 'number';
export const STRING = 'string';
export const TIMESTAMP = 'timestamp';

export const DOMAIN = 'domain';
export const FIELDSET = 'fieldset';

export const DATE_STR = 'date';
export const EMAIL = 'email';
export const GUID = 'guid';
export const NAME = 'name';
export const PASSWORD = 'password';
export const REGEX = 'regex';
export const URL = 'url';
export const USERNAME = 'username';

export const DATE_TYPES = [DATE, DATE_TIME] as const;
export const FLOAT_TYPES = [
  DECIMAL,
  DOUBLE,
  NUMBER,
] as const;
export const INTEGER_TYPES = [
  INTEGER,
  TIMESTAMP,
] as const;
export const NUMBER_TYPES = [
  ...INTEGER_TYPES,
  ...FLOAT_TYPES
] as const;
export const STRING_TYPES = [
  DATE_STR,
  EMAIL,
  GUID,
  NAME,
  PASSWORD,
  REGEX,
  STRING,
  URL,
  USERNAME,
] as const;

export type BooleanType = typeof BOOLEAN;
export type DateType = typeof DATE_TYPES[number];
export type FloatType = typeof FLOAT_TYPES[number];
export type IntegerType = typeof INTEGER_TYPES[number];
export type NumberType = typeof NUMBER_TYPES[number];
export type StringType = typeof STRING_TYPES[number];

export type PrimitiveType<T> = T extends Boolean
  ? BooleanType
  : T extends Date
  ? DateType
  : T extends BigInt
  ? IntegerType
  : T extends number
  ? NumberType
  : T extends string
  ? StringType
  : never;

export type Primitive = BigInt | boolean | Date | number | string;

export interface Domain<T extends Primitive> {
  default?: T;
  name: string;
  type: PrimitiveType<T>;
  member: typeof DOMAIN;
}

export interface Fieldset {
  name: string;
  fields: Record<string, Reference<Domain<Primitive> , 'name'>>;
  member: typeof FIELDSET;
}