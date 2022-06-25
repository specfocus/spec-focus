import type { Value } from '../values';

export declare type Tuple<optional extends boolean = false, nullable extends boolean = false>
  = [Value<optional, nullable>, ...Value<optional, nullable>[]];