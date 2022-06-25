export { default as isNumber } from './is-number';
export { NUMBER_TYPE, type NumberType } from './number-field';
export { create as default } from './number-schema';
export const INTEGER_TYPE = 'integer';
export type IntegerType = typeof INTEGER_TYPE;

export type NumberLike<nullable extends boolean = false, optional extends boolean = false>
  = bigint | number
  | (nullable extends true ? null : never)
  | (optional extends true ? undefined : never);