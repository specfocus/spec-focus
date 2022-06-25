import { Nil } from '../maybe';
import isArray from './is-array';

const isEmpty = (val: unknown): val is Nil =>
  !isArray(val) || val.length === 0;

export default isEmpty;