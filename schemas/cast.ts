import type { Defined } from '../maybe';

export type Cast<T, D> = T extends undefined
  ? // if default is undefined then it won't affect T
  D extends undefined
  ? T
  : Defined<T>
  : T;

export interface CastOptions<C = {}> {
  parent?: any;
  context?: C;
  assert?: boolean;
  stripUnknown?: boolean;
  // XXX: should be private?
  path?: string;
}