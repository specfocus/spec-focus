export const FUNCTION = "function";

export type Func = (...args: any) => any;

export const isFunction = (val: unknown): val is Func =>
  typeof val === FUNCTION;

export type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Func ? K : never;
}[keyof T];

export type FunctionProperties<T> = Pick<T, FunctionPropertyNames<T>>;

export type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Func ? never : K;
}[keyof T];

export type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;