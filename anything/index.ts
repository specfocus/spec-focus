import type { Tuple } from '../tuples';
import type { Value } from '../values';

export { type IsAny } from './any';

export declare type Anything<nullable extends boolean = false, optional extends boolean = false>
  = Many<nullable, optional> | Shape<nullable, optional> | Tuple<nullable, optional> | Value<nullable, optional> | Date;

export declare type Many<nullable extends boolean = false, optional extends boolean = false>
  = Anything<nullable, optional>[];

export interface Shape<nullable extends boolean = false, optional extends boolean = false>
  extends Record<string, Anything<nullable, optional>> { }