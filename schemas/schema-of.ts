import AnythingSchema from '../anything/anything-schema';
import { Maybe } from '../maybe';
import DateSchema from '../dates/date-schema';
import Lazy from '../lazy/lazy-schema';
import ArraySchema from '../many/array-schema';
import NumberSchema from '../numbers/number-schema';
import { AnyObject } from '../objects';
import ObjectSchema from '../shapes/shape-schema';
import StringSchema from '../strings/string-schema';
import type { Config } from './config';

// type ObjectSchemaOf<T extends AnyObject, CustomTypes = never> = ObjectSchema<{
//   [k in keyof T]-?:
//     | SchemaOf<T[k], CustomTypes>
//     | Lazy<SchemaOf<T[k], CustomTypes>>;
// }>;

export type SchemaOf<T, CustomTypes = never> = [T] extends [Array<infer E>]
  ? ArraySchema<SchemaOf<E, CustomTypes> | Lazy<SchemaOf<E, CustomTypes>>>
  : [T] extends [Maybe<string>]
  ? StringSchema<T>
  : [T] extends [Maybe<number>]
  ? NumberSchema<T>
  : T extends Date
  ? DateSchema<T>
  : T extends CustomTypes
  ? AnythingSchema<T, Config>
  : [T] extends [AnyObject]
  ? ObjectSchema<{
      [k in keyof T]-?:
        | SchemaOf<T[k], CustomTypes>
        | Lazy<SchemaOf<T[k], CustomTypes>>;
    }>
  : // ObjectSchemaOf<T, CustomTypes>
    never;

export type AnyObjectSchema = ObjectSchema<any, any, any>;
/*
export type {
  CreateErrorOptions, TestConfig, TestContext,
  TestFunction,
  TestOptions
} from '../validate/createValidation';
export type { SchemaOf, TypeOf, Asserts, Asserts as InferType, AnySchema };
*/
