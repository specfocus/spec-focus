import { Literal } from '.';
import isNumber from '../numbers/is-number';
import isString from '../strings/is-string';

const isLiteral = (val: unknown): val is Literal =>
  isNumber(val) || isString(val);

export default isLiteral;