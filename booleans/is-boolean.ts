import { BOOLEAN_TYPE } from './boolean-field';

const isBoolean = (val: unknown): val is boolean =>
  val instanceof Object && val.constructor === Boolean ||
  val instanceof Boolean || typeof val === BOOLEAN_TYPE;

export default isBoolean;