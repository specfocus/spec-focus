import isArray from './is-array';

/**
 * Creates an array excluding all provided values using SameValueZero for equality comparisons.
 *
 * @param array The array to filter.
 * @param values The values to exclude.
 * @return Returns the new array of filtered values.
 */
const without = <T, R extends T = T>(
  array: ArrayLike<T> | null | undefined,
  ...values: unknown[]
): T[] => {
  if (isArray(array)) {
    const result: T[] = [];
    for (const val of array) {
      if (!values.includes(val)) {
        result.push(val as T);
      }
    }
    return result;
  }
  return [];
}

export default without;