import isBoolean from '../booleans/is-boolean';
import isDate from '../dates/is-date';
import isNumber from '../numbers/is-number';
import isString from '../strings/is-string';

const isValue = (val: unknown): val is boolean | number | string =>
  isBoolean(val) || isDate(val) || isNumber(val) || isString(val);

export default isValue;