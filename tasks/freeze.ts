import assert from '../rules/assert';
import _freeze, { type Require, type RulesContextData } from '../rules/freeze';
import type { GenericRules } from '../rules/types';
import { PromiseLike, TaskContext } from './types';

const RESOURCE_404 = 'RESOURCE_404';

export type ResourceFactory<Resource> = (...args: string[]) => PromiseLike<Resource>;
export type ResourceFactories<Resources extends {}> = {
  [Name in keyof Resources]: () => PromiseLike<Resources[Name]>;
};

const freeze = <
  Rules extends GenericRules,
  Resources extends {} = {},
  Dependencies extends {} = {},
  Data extends RulesContextData<Rules> = RulesContextData<Rules>
>(
  data: Data,
  factories: ResourceFactories<Resources>,
  require: Require<Dependencies>
): TaskContext<Resources, Rules> => {
  const _factories = Object.freeze({ ...factories });
  const resolve = <Name extends keyof Resources>(name: Name, ...args: string[]): PromiseLike<Resources[Name]> => {
    const factory = _factories[name];
    assert(!!factory, RESOURCE_404);
    // @ts-ignore
    return factory.apply(null, args);
  };
  const immutable = Object.freeze({
    ..._freeze<Rules>(data, require),
    resolve
  });
  return immutable;
};

export default freeze;
