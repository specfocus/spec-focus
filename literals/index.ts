import { Primitive } from '../primitives';

export { default as isLiteral } from './is-literal';
export { create as default } from './literal-schema';

export type Literal<optional extends boolean = false, nullable extends boolean = false>
  = bigint | number | string
  | (nullable extends true ? null : never)
  | (optional extends true ? undefined : never);

  export type LiteralUnion<T extends U, U extends Primitive> =
  | T
  | (U & { _?: never });