import type { GenericRules, RuleContext } from '../rules/types';

export type GenericResources = {};

export interface TaskContext<
  Resources extends GenericResources = GenericResources,
  Rules extends GenericRules = GenericRules
> extends RuleContext<Rules> {
  readonly require: <Name extends keyof Resources>(name: Name, ...args: string[]) => PromiseLike<Resources[Name]>;
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