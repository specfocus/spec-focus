import { BooleanType } from './boolean';
import { FUNCTION } from "./function";
import { Nil } from './maybe';
import { NumberType } from './number';
import { RecordType } from './record';
import { StringType } from './string';

export const ARRAY = "array";

export type ArrayType =
  | [ArrayType | BooleanType | NumberType | StringType, typeof ARRAY]
  | [string, RecordType, typeof ARRAY];

export const isArray = <T = unknown>(val: unknown): val is T[] =>
  Array.isArray(val);

export const isArrayLike = (
  val: any
): val is IterableIterator<[number, unknown]> =>
  typeof val[Symbol.iterator] === FUNCTION;

export const isEmpty = (val: unknown): val is Nil =>
  !isArray(val) || val.length === 0;

export const isSet = (val: unknown): val is Set<unknown> =>
  isArrayLike(val) && !isArray(val);

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
/**
 * Creates an array excluding all provided values using SameValueZero for equality comparisons.
 *
 * @param array The array to filter.
 * @param values The values to exclude.
 * @return Returns the new array of filtered values.
 */
export const without = <T, R extends T = T>(
  array: ArrayLike<T> | null | undefined,
  ...values: unknown[]
): T[] => {
  if (isArray(array)) {
    const result: T[] = [];
    for (const val of array) {
      if (!values.includes(val)) {
        result.push(val as T);
      }
    }
    return result;
  }
  return [];
}

export const startsWith = (left: unknown, right: unknown): boolean => {
  if (!isArray(left) || !isArray(right)) {
    return false;
  }

  // compare lengths - can save a lot of time
  const l = right.length;
  if (left.length < l) {
    return false;
  }

  for (let i = 0; i < l; i++) {
    // Check if we have nested arrays
    if (isArray(left[i]) && isArray(right[i])) {
      // recurse into the nested arrays
      if (!areEqual(left[i], right[i])) {
          return false;
      }
    }
    else if (left[i] !== right[i]) {
      // Warning - two different object instances will never be equal: {x:20} != {x:20}
      return false;
    }
  }
  return true;
};

export const areEqual = (left: unknown, right: unknown): boolean => {
  if (!isArray(left) || !isArray(right)) {
    return false;
  }

  // compare lengths - can save a lot of time
  if (left.length !== right.length) {
      return false;
  }

  return startsWith(left, right);
};