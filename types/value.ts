import { isBoolean } from './boolean';
import { isDate } from './date';
import { isNumber } from './number';
import { isString } from './string';

export const isValue = (val: unknown): val is boolean | number | string =>
  isBoolean(val) || isDate(val) || isNumber(val) || isString(val);

export const valueOf = (val: unknown): unknown => {
  if (val instanceof Boolean) {
    return val.valueOf();
  }
  if (val instanceof Date) {
    return val.valueOf();
  }
  if (val instanceof Number) {
    return val.valueOf();
  }
  if (val instanceof String) {
    return val.valueOf();
  }
  return val;
};