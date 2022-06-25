import type { Value } from '../values';

import get from './get';
import set from './set';

export { get, set };

export { type IsFlatObject } from './flat';
export type Struct<V extends Value = Value> = Record<string, V | V[]>;

