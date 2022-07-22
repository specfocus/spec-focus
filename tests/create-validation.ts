import { default as Ref, default as Reference } from '../references/reference-schema';
import type { AnySchema } from '../schemas';
import { ValidationError } from '../validations/error';
import type { ExtraParams, Message } from '../messages';
import type { TestFunction, TestMap, TestOptions } from './types';

export type CreateErrorOptions = {
  path?: string;
  message?: Message<any>;
  params?: ExtraParams;
  type?: string;
};

export type TestConfig<TValue = unknown, Tests extends TestMap = TestMap> = {
  name?: string;
  message?: Message<any>;
  test: TestFunction<TValue, Tests>;
  params?: ExtraParams;
  exclusive?: boolean;
};

export type Test = ((opts: TestOptions) => Iterable<Error>) & {
  OPTIONS: TestConfig;
};

export default function createValidation(config: {
  name?: string;
  test: TestFunction;
  params?: ExtraParams;
  message?: Message<any>;
}): TestFunction {
  function* validate<TSchema extends AnySchema = AnySchema>(
    {
      value,
      path = '',
      label,
      options,
      originalValue,
      ...rest
    }: TestOptions<TSchema>
  ) {
    const { name, test, params, message } = config;
    const { parent, context } = options;

    function resolve<T>(item: T | Reference<T>) {
      return Ref.isRef(item) ? item.getValue(value, parent, context) : item;
    }

    function createError(overrides: CreateErrorOptions = {}) {
      const nextParams = {
        value,
        originalValue,
        label,
        path: overrides.path || path,
        ...params,
        ...overrides.params,
      };

      type Keys = (keyof typeof nextParams)[];
      for (const key of Object.keys(nextParams) as Keys)
        nextParams[key] = resolve(nextParams[key]);

      const error = new ValidationError(
        ValidationError.formatError(overrides.message || message, nextParams),
        value,
        nextParams.path,
        overrides.type || name,
      );
      error.params = nextParams;
      return error;
    }

    const ctx = {
      path,
      parent,
      type: name,
      createError,
      resolve,
      options,
      originalValue,
      ...rest,
    };

    let result;
    try {
      result = test.call(ctx, value, ctx);
    } catch (err: any) {
      return err;
    }

    if (ValidationError.isError(result)) {
      return result;
    } else if (!result) {
      return createError();
    }
  }

  validate.OPTIONS = config;

  return validate;
}
