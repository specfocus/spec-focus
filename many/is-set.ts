import isArray from './is-array';
import isArrayLike from './is-array-like';

const isSet = (val: unknown): val is Set<unknown> =>
  isArrayLike(val) && !isArray(val);

export default isSet;