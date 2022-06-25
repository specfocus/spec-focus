const isArray = <T = unknown>(val: unknown): val is T[] =>
  Array.isArray(val);

export default isArray;