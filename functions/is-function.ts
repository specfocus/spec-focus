export const FUNCTION_TYPE = 'function';
export type FunctionType = typeof FUNCTION_TYPE;
export type FunctionLike = (...args: any) => any;

const isFunction = (val: unknown): val is FunctionLike =>
  typeof val === FUNCTION_TYPE;

export default isFunction;

export type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends FunctionLike ? K : never;
}[keyof T];

export type FunctionProperties<T> = Pick<T, FunctionPropertyNames<T>>;

export type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends FunctionLike ? never : K;
}[keyof T];

export type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;