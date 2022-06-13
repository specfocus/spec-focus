import { isNumber } from './number';
import { isString } from './string';

export type Mixed = number | string;

export const isMixed = (val: unknown): val is Mixed =>
  isNumber(val) || isString(val);