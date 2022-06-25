export { type Shape as ObjectLike } from '../anything';
export { default as clone } from './clone';
export { default as flatten } from './flatten';
export { default as isEmpty } from './is-empty';
export { default as isObject } from './is-object';
export { default as isObjectType } from './is-object-type';
export * as PropExpr from './property-expr';
export { isSimpleBoolean, isSimpleNumber, isSimpleObject, isSimpleType, isSimpleValue } from './simple';
export type { SimpleArray, SimpleObject, SimpleTuple, SimpleType, SimpleValue } from './simple';
export { default as simplify } from './simplify';

export const OBJECT = 'object';

export declare type AnyObject = Record<string, any>;

export type RequiredMembers<T extends {}> = {
  [K in keyof T]-?: undefined extends T[K] ? never : K
}[keyof T];
