import isString from '../strings/is-string';

export type ConstructorType<T = any> = new (...args: any[]) => T;

export const isInstanceOf = <T = any>(val: unknown, type: ConstructorType<T> | string): val is T => (
  ![, null].includes(val) &&
  (isString(type) ? val.constructor.name === type : val.constructor === type)
);

export default isInstanceOf;