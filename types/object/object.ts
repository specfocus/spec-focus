import { isFunction } from '../function';
import { isNil, Nil } from '../maybe';
import { isValue } from '../value';

export const isEmpty = (val: unknown): val is Nil =>
  val == null || (isObject(val) && Object.keys(val).length === 0);

export const isObject = (val: unknown): val is Record<string, any> =>
  !isNil(val) && !isValue(val) && !Array.isArray(val) && !isFunction(val) && !(val instanceof Date);