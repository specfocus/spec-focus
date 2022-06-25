import isArray from '../many/is-array';
import { isObject } from '../objects';
import isString from '../strings/is-string';
import { type Nil, isNil } from './nil';

export { type Defined } from './defined';
export { isUndefined } from './undefined';
export { type Nil, isNil } from './nil';
export { type NotNull, isNull } from './null';
export { type IsNever } from './never';

export type Maybe<T> = T | Nil;

export type MaybePromise<T> = Promise<T> | T;

export type Optionals<T> = Extract<T, null | undefined>;

export type Preserve<T, U> = T extends U ? U : never;

export const isEmpty = (val: unknown): val is Nil =>
  isNil(val) ||
  (isString(val) && val.length === 0) ||
  (isArray(val) && val.length === 0) ||
  (isObject(val) && !(Object.keys(val) || val).length);

export const isSome = <T>(input: T): input is Exclude<T, Nil> => input != null;

export type If<T, Y, N> = Exclude<T, undefined> extends never ? Y : N;

/* this seems to force TS to show the full type instead of all the wrapped generics */
export type _<T> = T extends {} ? { [k in keyof T]: T[k] } : T;
