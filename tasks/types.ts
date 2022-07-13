import { MaybePromise } from '../maybe';
import type { GenericRules, RuleContext } from '../rules/types';

export interface TaskContext<
  Resources extends {} = {},
  Rules extends GenericRules = GenericRules,
  Dependencies extends {} = {}
> extends RuleContext<Rules, Dependencies> {
  readonly resolve: <Name extends keyof Resources>(name: Name, ...args: string[]) => MaybePromise<Resources[Name]>;
}

export type Task<
  Result,
  Params extends {},
  Context extends TaskContext
> = (
  params: Params,
  context: Context
) => MaybePromise<Result>;