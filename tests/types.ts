import { Anything } from '../anything';
import type { ExtraParams, Message } from '../messages';
import type { Rule, RuleContext } from '../rules/types';
import { AnySchema } from '../schemas';
import type { InternalOptions, ValidateOptions } from '../validations/options';

export type TestMap = Record<string, Test<Anything>>;

export interface TestContext<Tests extends TestMap = TestMap> extends RuleContext<Tests> {
  path: string;
  schema: AnySchema<any>;
}
/*
export type TestContext<TContext = {}> = {
  path: string;
  options: ValidateOptions<TContext>;
  parent: any;
  schema: AnySchema<any>;
  resolve: <T>(value: T | Reference<T>) => T;
  createError: (params?: CreateErrorOptions) => Iterable<ValidationError>;
};
*/

export interface TestOptions<TSchema extends AnySchema = AnySchema> {
  name?: string;
  message?: Message<any>;
  params?: ExtraParams;
  exclusive?: boolean;
}

export type Test<T, TSchema extends AnySchema = AnySchema> = Rule<
  Iterable<Error>,
  T,
  TestOptions<TSchema>,
  TestContext
>;

export type TestFunction<T = unknown, Rules extends TestMap = TestMap> = (
  this: TestContext<Rules>,
  value: T,
  options: TestOptions,
) => Iterable<Error>;
