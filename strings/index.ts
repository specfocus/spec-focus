export { default as isString } from './is-string';
export { STRING_TYPE, type StringType } from './string-field';
export { create as default } from './string-schema';
export type StringLike<optional extends boolean = false, nullable extends boolean = false>
  = boolean
  | (nullable extends true ? null : never)
  | (optional extends true ? undefined : never);
