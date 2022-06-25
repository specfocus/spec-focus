import { Nil } from '../maybe';
import isObject from './is-object';

export type EmptyObject = { [K in string | number]: never };

const isEmpty = (val: unknown): val is Nil =>
  val == null || (isObject(val) && Object.keys(val).length === 0);

export default isEmpty;
