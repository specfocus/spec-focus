// <reference types="../../typings/number" />
// <reference types="../../typings/string" />

// used for counting
export type CardinalNumber = PositiveInteger;
export type Count = NonNegativeInteger;
export type FibonacciNumber = PositiveInteger;
export type Integer = number;
export type NaN = number;
export type NaturalNumber = CardinalNumber;
export type NegativeInteger = NonPositiveInteger;
export type NegativeNumber = NonPositiveNumber;
export type NonNegativeInteger = Integer;
export type NonNegativeNumber = number;
export type NonPositiveInteger = Integer;
export type NonPositiveNumber = number;
export type NumberOrString = number | string;
// used for ordering
export type OrdinalNumber = NonNegativeInteger;
export type PerfectSquare = PositiveInteger;
export type Pi = 3.14159265358979323846;
export type PositiveInteger = NonNegativeInteger;
export type PositiveNumber = NonNegativeNumber;
export type PrimeNumber = PositiveInteger;


import { isString } from "./string";
import { valueOf } from './value';

export const DECIMAL = "decimal";
export const DOUBLE = "double";
export const INTEGER = "integer";
export const ONE = 1;
export const NUMBER = "number";
export const TIMESTAMP = "timestamp";
export const ZERO = 0;

export const INTEGER_TYPES = [
  INTEGER,
  TIMESTAMP,
] as const;

export type IntegerType = typeof INTEGER_TYPES[number];

export const FLOAT_TYPES = [
  DECIMAL,
  DOUBLE,
  NUMBER,
] as const;

export type FloatType = typeof FLOAT_TYPES[number];

export const NUMBER_TYPES = [
  ...INTEGER_TYPES,
  ...FLOAT_TYPES
] as const;

export type NumberType = typeof NUMBER_TYPES[number];

export const isInteger = (val: unknown): val is Integer =>
  Number.isInteger(valueOf(val));

export const isNaN = (val: unknown): val is NaN => Number.isNaN(val);

export const isNegativeInteger = (val: unknown): val is NegativeInteger =>
  isInteger(val) && val < ZERO;

export const isNegativeNumber = (val: unknown): val is NegativeNumber =>
  isNumber(val) && val < ZERO;

export const isNonNegativeInteger = (val: unknown): val is NonNegativeInteger =>
  isInteger(val) && val <= ZERO;

export const isNonNegativeNumber = (val: unknown): val is NonNegativeNumber =>
  isNumber(val) && val <= ZERO;

export const isNonPositiveInteger = (val: unknown): val is NonPositiveInteger =>
  isInteger(val) && val <= ZERO;

export const isNonPositiveNumber = (val: unknown): val is NonPositiveNumber =>
  isNumber(val) && val <= ZERO;

export const isNumber = (val: unknown): val is number =>
  val instanceof Object && val.constructor === Number ||
  val instanceof Number || (typeof val === NUMBER && val === val);

// A utility function that returns true if x is perfect square
export const isPerfectSquare = (val: unknown): val is PerfectSquare => {
  if (!isPositiveInteger(val)) {
    return false;
  }
  const sqrt = Math.sqrt(val);
  return sqrt * sqrt === val;
};

// Returns true if n is a Fibinacci Number, else false
export const isFibonacci = (val: unknown): val is FibonacciNumber => {
  if (!isPositiveInteger(val)) {
    return false;
  }
  // n is Fibinacci if one of 5*n*n + 4 or 5*n*n - 4 or both
  // is a perferct square
  return (
    isPerfectSquare(5 * val * val + 4) || isPerfectSquare(5 * val * val - 4)
  );
};

export const isPositiveInteger = (val: unknown): val is PositiveInteger =>
  isInteger(val) && val > ZERO;

export const isPositiveNumber = (val: unknown): val is PositiveNumber =>
  isNumber(val) && val > ZERO;

export const isPrime = (val: unknown): val is PrimeNumber => {
  if (!isPositiveInteger(val)) {
    return false;
  }

  if (val === 2 || val === 3) {
    return true;
  } else if (val <= 1 || val % 2 === 0 || val % 3 === 0) {
    return false;
  }

  let i = 5;
  while (Math.pow(i, 2) <= val) {
    if (val % i === 0 || val % (i + 2) === 0) {
      return false;
    }
    i += 6;
  }

  return true;
};

export const isLeapYear = (val: unknown): val is number =>
  isPositiveInteger(val) && new Date(val, 1, 29).getMonth() === 1;

export const isNumberOrString = (val: unknown): val is NumberOrString =>
  isNumber(val) || isString(val);
