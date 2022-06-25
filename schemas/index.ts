import AnythingSchema from '../anything/anything-schema';
import Lazy from '../lazy/lazy-schema';
import { Config } from './config';

export type { Anything as Thing, Many as Bunch, Shape } from '../anything';
export { default as boolean } from '../booleans';
export { default as lazy } from '../lazy';
export { default as literal } from '../literals';
export type { Literal } from '../literals';
export type { ReadonlyVars, Vars } from '../literals/vars';
export { default as many } from '../many';
export type { Flags, ReadonlyFlags } from '../many/flags';
export { default as number } from '../numbers';
export { default as shape } from '../shapes';
export { default as string } from '../strings';
export type { Struct } from '../structs';
export type { Tuple } from '../tuples';
export type { Value } from '../values';

export type AnySchema<TType = any, C extends Config = any> = AnythingSchema<
  TType,
  C
>;

export type Asserts<TSchema extends TypedSchema> = TSchema['__outputType'];

export type TypeOf<TSchema extends TypedSchema> = TSchema['__type'];

export type TypedSchema = {
  __type: any;
  __outputType: any;
};

export type SchemaLike = AnySchema | Lazy<any>;

export type SchemaOptions<TDefault> = {
  type?: string;
  spec?: SchemaSpec<TDefault>;
};

export type SchemaSpec<TDefault> = {
  nullable: boolean;
  optional: boolean;
  default?: TDefault | (() => TDefault);
  abortEarly?: boolean;
  strip?: boolean;
  strict?: boolean;
  recursive?: boolean;
  label?: string | undefined;
  meta?: any;
};

export type TransformFunction<T extends AnySchema> = (
  this: T,
  value: any,
  originalValue: any,
  schema: T,
) => any;