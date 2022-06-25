import type { Anything } from '../anything';
import type { Defined, Preserve } from '../maybe';
import type { AnySchema } from '../schemas';

export type AnyConfig = Config<any, any>;

export interface Config<C = Anything, F extends Flags = ''> {
  context: C;
  flags: F;
}

export type ConfigOf<T> = T extends AnySchema<any, infer C> ? C : never;

export type ContextOf<T> = ConfigOf<T>['context'];

export type Flags = 's' | 'd' | '';

export type FlagsOf<T> = T extends AnySchema ? T['__flags'] : never;

export type HasFlag<T, F extends Flags> = F extends FlagsOf<T> ? true : never;

export type ResolveFlags<T, F extends Flags> = Preserve<F, 'd'> extends never
  ? T
  : Defined<T>;

export type MergeConfig<T extends AnyConfig, U extends AnyConfig> = Config<
  T['context'] & U['context'],
  T['flags'] | U['flags']
>;

export type SetFlag<C extends AnyConfig, F extends Flags> = C extends Config<
  infer Context,
  infer Old
>
  ? Config<Context, Exclude<Old, ''> | F>
  : never;

export type ToggleDefault<C extends AnyConfig, D> = Preserve<
  D,
  undefined
> extends never
  ? SetFlag<C, 'd'>
  : UnsetFlag<C, 'd'>;

export type UnsetFlag<C extends AnyConfig, F extends Flags> = C extends Config<
  infer Context,
  infer Old
>
  ? Exclude<Old, F> extends never
  ? Config<Context, ''>
  : Config<Context, Exclude<Old, F>>
  : never;