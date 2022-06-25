import type { GenericRules, RuleContext } from '../rules/types';

export interface TaskContext<
  Resources extends {} = {},
  Rules extends GenericRules = GenericRules,
  Dependencies extends {} = {}
> extends RuleContext<Rules, Dependencies> {
  readonly resolve: <Name extends keyof Resources>(name: Name, ...args: string[]) => PromiseLike<Resources[Name]>;
}

export type PromiseLike<T> = T | Promise<T>;
export type Task<
  Output,
  Params extends {},
  Context extends TaskContext
> = (
  params: Params,
  context: Context
) => PromiseLike<Output>;
export type PullTask<
  Output,
  Params extends {},
  Context extends TaskContext
> = (
  params: Params,
  context: Context
) => AsyncIterable<Output>;