import { FUNCTION_TYPE } from '../functions';

const isArrayLike = (
  val: any
): val is IterableIterator<[number, unknown]> =>
  typeof val[Symbol.iterator] === FUNCTION_TYPE;

export default isArrayLike;