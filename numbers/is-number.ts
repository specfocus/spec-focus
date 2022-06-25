import { NUMBER_TYPE } from './number-field';

const isNumber = (val: unknown): val is number =>
  val instanceof Object && val.constructor === Number ||
  val instanceof Number || (typeof val === NUMBER_TYPE && val === val);

export default isNumber;