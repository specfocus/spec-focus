import assert from '../rules/assert';
import _freeze, { RulesContextData } from '../rules/freeze';
import { GenericResources, PromiseLike, TaskContext } from './types';
import type { GenericRules, RuleContext } from '../rules/types';

const RESOURCE_404 = 'RESOURCE_404';

export type ResourceFactory<Resource> = (...args: string[]) => PromiseLike<Resource>;
export type ResourceFactories<Resources extends GenericResources> = {
  [Name in keyof Resources]: () => PromiseLike<Resources[Name]>;
};

export interface TaskContextData<
  Resources extends GenericResources,
  Rules extends GenericRules
> extends RulesContextData<Rules> {
  factories: ResourceFactories<Resources>;
}

const freeze = <
  Resources extends GenericResources,
  Rules extends GenericRules,
  Data extends TaskContextData<Resources, Rules>
>(
  { factories, ...data }: Data
): TaskContext<Resources, Rules> => {
  const _factories = Object.freeze({ ...factories });
  const require = <Name extends keyof Resources>(name: Name, ...args: string[]): PromiseLike<Resources[Name]> => {
    const factory = _factories[name];
    assert(!!factory, RESOURCE_404);
    // @ts-ignore
    return factory.apply(null, args);
  };
  const immutable = Object.freeze({
    ..._freeze<Rules>(data),
    require
  });
  return immutable;
};

export default freeze;
