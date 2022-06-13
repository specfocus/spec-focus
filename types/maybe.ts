import { isArray } from "./array";
import { isObject } from "./object";
import { isString } from "./string";

export type Defined<T> = T extends undefined ? never : T;

export type Maybe<T> = T | Nil;

export type MaybePromise<T> = Promise<T> | T;

export type Nil = null | undefined;

export type NotNull<T> = T extends null ? never : T;

export type Optionals<T> = Extract<T, null | undefined>;

export type Preserve<T, U> = T extends U ? U : never;

export const isEmpty = (val: unknown): val is Nil =>
  isNil(val) ||
  (isString(val) && val.length === 0) ||
  (isArray(val) && val.length === 0) ||
  (isObject(val) && !(Object.keys(val) || val).length);

export const isNull = (val: unknown): val is null => val === null;

export const isNil = (val: unknown): val is Nil =>
  val === undefined || val === null || Number.isNaN(val);

export const isSome = <T>(input: T): input is Exclude<T, Nil> => input != null;

export const isUndefined = (val: unknown): val is undefined =>
  val === undefined;

export type If<T, Y, N> = Exclude<T, undefined> extends never ? Y : N;

/* this seems to force TS to show the full type instead of all the wrapped generics */
export type _<T> = T extends {} ? { [k in keyof T]: T[k] } : T;
