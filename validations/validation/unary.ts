import { Stream } from 'stream';
import { FUNCTION_TYPE } from '../../functions';
import isNumber from '../../numbers/is-number';
import { isPositiveInteger, NaN, NumberOrString } from '../../numbers/number';
import isObject from '../../objects/is-object';
import isString from '../../strings/is-string';
import { SYMBOL } from '../../symbols/is-symbol';
import { isNull } from '../../maybe';

export type ValidationTest = (val: unknown) => boolean;

export const isFunction = (val: unknown): val is Function => typeof val === FUNCTION_TYPE;

export const isLeapYear = (val: unknown): val is number => isPositiveInteger(val) && new Date(val, 1, 29).getMonth() === 1;

export const isNaN = (val: unknown): val is NaN => Number.isNaN(val);

export const isNumberOrString = (val: unknown): val is NumberOrString => isNumber(val) || isString(val);

export const isPrimitive = (val: unknown): boolean => Object(val) !== val;


/*
export const isSorted = (arr: Array<number>): false | 1 | -1 => {
  let direction = -(arr[0] - arr[1]);
  for (let [i, val] of arr.entries()) {
    direction = !direction ? -(arr[i - 1] - arr[i]) : direction;
    if (i === arr.length - 1) {
      return !direction ? false : <1 | -1>(direction / Math.abs(direction));
    } else if ((val - arr[i + 1]) * direction > 0) {
      return false;
    }
  }
  throw 'never';
};
*/
export const isStream = (val: any): val is Stream => !isNull(val) && isObject(val) && typeof val.pipe === FUNCTION_TYPE;

/// export const isString = (val: unknown): boolean => (typeof val === 'string');

export const isSymbol = (val: unknown): val is symbol => typeof val === SYMBOL;

export const isUndefined = (val: unknown): val is undefined => val === undefined;