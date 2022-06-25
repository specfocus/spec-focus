const isPromise = <T>(val: unknown): val is Promise<T> =>
  Promise.resolve(val) == val;

export default isPromise;