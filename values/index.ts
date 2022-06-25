import type { Literal } from '../literals';

export type { NestedValue } from '../values/nested';

export declare type Value<optional extends boolean = false, nullable extends boolean = false>
  = boolean | Literal<nullable, optional>;