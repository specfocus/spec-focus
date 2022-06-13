import MixedSchema, { create as mixedCreate } from './mixed';
import BooleanSchema, { create as boolCreate } from './boolean';
import StringSchema, { create as stringCreate } from './string';
import NumberSchema, { create as numberCreate } from './number';
import DateSchema, { create as dateCreate } from './date';
import ObjectSchema, { create as objectCreate } from './object';
import ArraySchema, { create as arrayCreate } from './array';
import { create as refCreate } from './reference';
import Lazy, { create as lazyCreate } from './lazy';
import { ValidationError } from './validate/error';
import reach from './reach';
import isSchema from './validate/isSchema';
import setLocale from './validate/setLocale';
import BaseSchema, { AnySchema } from './base';
import type { TypeOf, Asserts, Config } from './base';
import { Maybe } from '../types/maybe';
import { AnyObject } from '../types/object';

export { ARRAY_TYPE } from './array';
export { BOOLEAN_TYPE } from './boolean';
export { NUMBER_TYPE } from './number';
export { OBJECT_TYPE } from './object';
export { STRING_TYPE } from './string';

export type { ArrayJsonSchema, ArrayType } from './array';
export type { BooleanJsonSchema, BooleanType } from './boolean';
export type { NumberJsonSchema, NumberType } from './number';
export type { ObjectJsonSchema, ObjectType } from './object';
export type { StringJsonSchema, StringType } from './string';

function addMethod<T extends AnySchema>(
  schemaType: (...arg: any[]) => T,
  name: string,
  fn: (this: T, ...args: any[]) => T,
): void;
function addMethod<T extends new (...args: any) => AnySchema>(
  schemaType: T,
  name: string,
  fn: (this: InstanceType<T>, ...args: any[]) => InstanceType<T>,
): void;
function addMethod(schemaType: any, name: string, fn: any) {
  if (!schemaType || !isSchema(schemaType.prototype))
    throw new TypeError('You must provide a yup schema constructor function');

  if (typeof name !== 'string')
    throw new TypeError('A Method name must be provided');
  if (typeof fn !== 'function')
    throw new TypeError('Method function must be provided');

  schemaType.prototype[name] = fn;
}

// type ObjectSchemaOf<T extends AnyObject, CustomTypes = never> = ObjectSchema<{
//   [k in keyof T]-?:
//     | SchemaOf<T[k], CustomTypes>
//     | Lazy<SchemaOf<T[k], CustomTypes>>;
// }>;

type SchemaOf<T, CustomTypes = never> = [T] extends [Array<infer E>]
  ? ArraySchema<SchemaOf<E, CustomTypes> | Lazy<SchemaOf<E, CustomTypes>>>
  : [T] extends [Maybe<string>]
  ? StringSchema<T>
  : [T] extends [Maybe<number>]
  ? NumberSchema<T>
  : T extends Date
  ? DateSchema<T>
  : T extends CustomTypes
  ? BaseSchema<T, Config>
  : [T] extends [AnyObject]
  ? ObjectSchema<{
      [k in keyof T]-?:
        | SchemaOf<T[k], CustomTypes>
        | Lazy<SchemaOf<T[k], CustomTypes>>;
    }>
  : //ObjectSchemaOf<T, CustomTypes>
    never;

export type AnyObjectSchema = ObjectSchema<any, any, any>;

export type { SchemaOf, TypeOf, Asserts, Asserts as InferType, AnySchema };

export {
  mixedCreate as mixed,
  boolCreate as bool,
  boolCreate as boolean,
  stringCreate as string,
  numberCreate as number,
  dateCreate as date,
  objectCreate as object,
  arrayCreate as array,
  refCreate as ref,
  lazyCreate as lazy,
  reach,
  isSchema,
  addMethod,
  setLocale,
  ValidationError,
};

export {
  BaseSchema,
  MixedSchema,
  BooleanSchema,
  StringSchema,
  NumberSchema,
  DateSchema,
  ObjectSchema,
  ArraySchema,
};

export type {
  CreateErrorOptions,
  TestContext,
  TestFunction,
  TestOptions,
  TestConfig,
} from './validate/createValidation';
