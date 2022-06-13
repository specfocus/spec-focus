export { default as clone } from './clone';
export { default as flatten } from './flatten';
export { isEmpty, isObject } from './object';
export { isSimpleBoolean, isSimpleNumber, isSimpleObject, isSimpleType, isSimpleValue } from './simple';
export type { SimpleArray, SimpleObject, SimpleTuple, SimpleType, SimpleValue } from './simple';
export { default as simplify } from './simplify';
export * as PropExpr from './property-expr';

export const OBJECT = 'object';

export declare type AnyObject = Record<string, any>;

export type RequiredMembers<T extends {}> = {
  [K in keyof T]-?: undefined extends T[K] ? never : K
}[keyof T];
