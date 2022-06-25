import { isNil } from '../maybe';
import { isFunction } from '../functions';
import isValue from '../values/is-value';

const isObject = (val: unknown): val is Record<string, any> =>
  !isNil(val) && !isValue(val) && !Array.isArray(val) && !isFunction(val) && !(val instanceof Date);

export default isObject;