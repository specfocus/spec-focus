import { STRING_TYPE } from './string-field';

const isString = (val: unknown): val is string =>
  val instanceof Object && val.constructor === String ||
  val instanceof String || typeof val === STRING_TYPE;

export default isString;