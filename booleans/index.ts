export { BOOLEAN_TYPE, type BooleanType } from './boolean-field';
export { create as default } from './boolean-schema';
export { default as isBoolean } from './is-boolean';
export type BooleanLike<optional extends boolean = false, nullable extends boolean = false>
  = boolean
  | (nullable extends true ? null : never)
  | (optional extends true ? undefined : never);