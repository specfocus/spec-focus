import Condition, { type ConditionOptions, type ResolveOptions } from '../conditions';
import type { Callback } from '../functions/callback';
import type { Thunk } from '../functions/thunk';
import clone from '../objects/clone';
import { getIn } from '../objects/reach';
import { default as Ref, default as Reference, ReferenceSet } from '../references/reference-schema';
import type { AnySchema, SchemaOptions, SchemaSpec, TransformFunction } from '../schemas';
import { CastOptions } from '../schemas/cast';
import { Config, ResolveFlags, SetFlag } from '../schemas/config';
import { SchemaDescription } from '../schemas/description';
import createValidation, { Test, TestConfig, TestFunction } from '../validations/create-validation';
import { ValidationError } from '../validations/error';
import { mixed as locale } from '../validations/locale';
import type { Message } from '../messages';
import type { InternalOptions, ValidateOptions } from '../validations/options';
import printValue from '../validations/print-value';
import runTests from '../validations/run-tests';
import toArray from '../validations/to-array';
import isAbsent from '../anything/is-absent';
import type { Defined, Maybe, Preserve } from '../maybe';

export default abstract class Validatable<
  TType = any,
  TConfig extends Config<any, any> = Config,
> {
  readonly type: string;

  readonly __type: TType;
  readonly __outputType: ResolveFlags<TType, TConfig['flags']>;

  readonly __flags: TConfig['flags'];
  readonly __isSchema__: boolean;

  readonly deps: readonly string[] = [];

  tests: Test[];
  transforms: TransformFunction<AnySchema>[];

  private conditions: Condition[] = [];

  private _mutate?: boolean;

  private internalTests: Record<string, Test | null> = {};

  protected _whitelist = new ReferenceSet();
  protected _blacklist = new ReferenceSet();

  protected exclusiveTests: Record<string, boolean> = Object.create(null);

  spec: SchemaSpec<any>;

  constructor(options?: SchemaOptions<any>) {
    this.tests = [];
    this.transforms = [];

    this.withMutation(() => {
      this.typeError(locale.notType);
    });

    this.type = options?.type || ('mixed' as const);

    this.spec = {
      strip: false,
      strict: false,
      recursive: true,
      nullable: false,
      optional: true,
      ...options?.spec,
    };

    this.withMutation((s) => {
      s.nonNullable();
    });
  }

  // TODO: remove
  get _type() {
    return this.type;
  }

  protected _typeCheck(_value: any): _value is NonNullable<TType> {
    return true;
  }

  clone(spec?: Partial<SchemaSpec<any>>): this {
    if (this._mutate) {
      if (spec) Object.assign(this.spec, spec);
      return this;
    }

    // if the nested value is a schema we can skip cloning, since
    // they are already immutable
    const next: AnySchema = Object.create(Object.getPrototypeOf(this));

    // @ts-expect-error this is readonly
    next.type = this.type;

    next._whitelist = this._whitelist.clone();
    next._blacklist = this._blacklist.clone();
    next.internalTests = { ...this.internalTests };
    next.exclusiveTests = { ...this.exclusiveTests };

    // @ts-expect-error this is readonly
    next.deps = [...this.deps];
    next.conditions = [...this.conditions];
    next.tests = [...this.tests];
    next.transforms = [...this.transforms];
    next.spec = clone({ ...this.spec, ...spec });

    return next as this;
  }

  label(label: string) {
    const next = this.clone();
    next.spec.label = label;
    return next;
  }

  meta(): Record<string, unknown> | undefined;
  meta(obj: Record<string, unknown>): this;
  meta(...args: [Record<string, unknown>?]) {
    if (args.length === 0) return this.spec.meta;

    const next = this.clone();
    next.spec.meta = Object.assign(next.spec.meta || {}, args[0]);
    return next;
  }

  // withContext<C extends AnyObject>(): AnythingSchema<
  //   TType,
  //   C,
  //   TOut
  // > {
  //   return this as any;
  // }

  withMutation<T>(fn: (schema: this) => T): T {
    const before = this._mutate;
    this._mutate = true;
    const result = fn(this);
    this._mutate = before;
    return result;
  }

  concat(schema: this): this;
  concat(schema: AnySchema): AnySchema;
  concat(schema: AnySchema): AnySchema {
    if (!schema || schema === this) return this;

    if (schema.type !== this.type && this.type !== 'mixed')
      throw new TypeError(
        `You cannot \`concat()\` schema's of different types: ${this.type} and ${schema.type}`,
      );

    const base = this;
    const combined = schema.clone();

    const mergedSpec = { ...base.spec, ...combined.spec };

    // if (combined.spec.nullable === UNSET)
    //   mergedSpec.nullable = base.spec.nullable;

    // if (combined.spec.presence === UNSET)
    //   mergedSpec.presence = base.spec.presence;

    combined.spec = mergedSpec;
    combined.internalTests = {
      ...base.internalTests,
      ...combined.internalTests,
    };

    // manually merge the blacklist/whitelist (the other `schema` takes
    // precedence in case of conflicts)
    combined._whitelist = base._whitelist.merge(
      schema._whitelist,
      schema._blacklist,
    );
    combined._blacklist = base._blacklist.merge(
      schema._blacklist,
      schema._whitelist,
    );

    // start with the current tests
    combined.tests = base.tests;
    combined.exclusiveTests = base.exclusiveTests;

    // manually add the new tests to ensure
    // the deduping logic is consistent
    combined.withMutation((next) => {
      schema.tests.forEach((fn) => {
        next.test(fn.OPTIONS);
      });
    });

    combined.transforms = [...base.transforms, ...combined.transforms];
    return combined as any;
  }

  isType(v: unknown): v is TType {
    if (v == null) {
      if (this.spec.nullable && v === null) return true;
      if (this.spec.optional && v === undefined) return true;
      return false;
    }

    return this._typeCheck(v);
  }

  resolve(options: ResolveOptions) {
    let schema = this;

    if (schema.conditions.length) {
      const conditions = schema.conditions;

      schema = schema.clone();
      schema.conditions = [];
      schema = conditions.reduce(
        (prevSchema, condition) => condition.resolve(prevSchema, options),
        schema,
      ) as this;

      schema = schema.resolve(options);
    }

    return schema;
  }

  /**
   *
   * @param {*} value
   * @param {Object} options
   * @param {*=} options.parent
   * @param {*=} options.context
   */
  cast(
    value: any,
    options: CastOptions<TConfig['context']> = {},
  ): this['__outputType'] {
    const resolvedSchema = this.resolve({
      value,
      ...options,
      // parent: options.parent,
      // context: options.context,
    });

    const result = resolvedSchema._cast(value, options);

    if (options.assert !== false && !resolvedSchema.isType(result)) {
      const formattedValue = printValue(value);
      const formattedResult = printValue(result);
      throw new TypeError(
        `The value of ${options.path || 'field'
        } could not be cast to a value ` +
        `that satisfies the schema type: "${resolvedSchema._type}". \n\n` +
        `attempted value: ${formattedValue} \n` +
        (formattedResult !== formattedValue
          ? `result of cast: ${formattedResult}`
          : ''),
      );
    }

    return result;
  }

  protected _cast(
    rawValue: any,
    _options: CastOptions<TConfig['context']>,
  ): any {
    let value =
      rawValue === undefined
        ? rawValue
        : this.transforms.reduce(
          (prevValue, fn) => fn.call(this, prevValue, rawValue, this),
          rawValue,
        );

    if (value === undefined) {
      value = this.getDefault();
    }

    return value;
  }

  protected _validate = function* (
    _value: any,
    options: InternalOptions<TConfig['context']> = {}
  ): Generator<Error> {
    const {
      path,
      from = [],
      originalValue = _value,
      strict = this.spec.strict,
    } = options;

    let value = _value;
    if (!strict) {
      // this._validating = true;
      value = this._cast(value, { assert: false, ...options });
      // this._validating = false;
    }
    // value is cast, we can check if it meets type requirements
    const args = {
      value,
      path,
      options,
      originalValue,
      schema: this,
      label: this.spec.label,
      from,
    };

    for (const err of runTests(
      {
        tests: Object.values(this.internalTests),
        args,
        value,
        path
      }
    )) {
      yield err;
    }

    for (const err of runTests(
      {
        tests: this.tests,
        args,
        value,
        path
      }
    )) {
      yield err;
    }
  };

  validate(
    value: any,
    options?: ValidateOptions<TConfig['context']>
  ): Iterable<Error> {
    const schema = this.resolve({ ...options, value });
    return schema._validate(value, options);
  }

  isValid(
    value: any,
    options?: ValidateOptions<TConfig['context']>,
  ): boolean {
    return Array.from(this.validate(value, options)).length === 0;
  }

  protected _getDefault() {
    const defaultValue = this.spec.default;

    if (defaultValue == null) {
      return defaultValue;
    }

    return typeof defaultValue === 'function'
      ? defaultValue.call(this)
      : clone(defaultValue);
  }

  getDefault(
    options?: ResolveOptions,
    // If schema is defaulted we know it's at least not undefined
  ): Preserve<TConfig['flags'], 'd'> extends never
    ? undefined
    : Defined<TType> {
    const schema = this.resolve(options || {});
    return schema._getDefault();
  }

  default(def: Thunk<any>): any {
    if (arguments.length === 0) {
      return this._getDefault();
    }

    const next = this.clone({ default: def });

    return next as any;
  }

  strict(isStrict = true) {
    return this.clone({ strict: isStrict });
  }

  protected _isPresent(value: any) {
    return value != null;
  }

  protected nullability(nullable: boolean, message?: Message<any>) {
    const next = this.clone({ nullable });
    next.internalTests.nullable = createValidation({
      message,
      name: 'nullable',
      test: function* (value) {
        if (value === null && !this.schema.spec.nullable) {
          return new ValidationError('nullable');
        }
      },
    });
    return next;
  }

  protected optionality(optional: boolean, message?: Message<any>) {
    const next = this.clone({ optional });
    next.internalTests.optionality = createValidation({
      message,
      name: 'optionality',
      test(value) {
        if (value === undefined) {
          return this.schema.spec.optional;
        }
      },
    });
    return next;
  }

  optional(): any {
    return this.optionality(true);
  }
  defined(message = locale.defined): any {
    return this.optionality(false, message);
  }

  // nullable(message?: Message): any
  // nullable(nullable: true): any
  // nullable(nullable: false, message?: Message): any
  nullable(): any {
    return this.nullability(true);
  }
  nonNullable(message = locale.notNull): any {
    return this.nullability(false, message);
  }

  required(message: Message<any> = locale.required): any {
    return this.clone().withMutation((next) =>
      next
        .nonNullable(message)
        .defined(message)
        .test({
          message,
          name: 'required',
          exclusive: true,
          test(value: any) {
            return this.schema._isPresent(value);
          },
        }),
    ) as any;
  }

  notRequired(): any {
    return this.clone().withMutation((next) => {
      next.tests = next.tests.filter(
        (test) => test.OPTIONS.name !== 'required',
      );
      return next.nullable().optional();
    });
  }

  transform(fn: TransformFunction<this>) {
    const next = this.clone();
    next.transforms.push(fn as TransformFunction<any>);
    return next;
  }

  /**
   * Adds a test function to the schema's queue of tests.
   * tests can be exclusive or non-exclusive.
   *
   * - exclusive tests, will replace any existing tests of the same name.
   * - non-exclusive: can be stacked
   *
   * If a non-exclusive test is added to a schema with an exclusive test of the same name
   * the exclusive test is removed and further tests of the same name will be stacked.
   *
   * If an exclusive test is added to a schema with non-exclusive tests of the same name
   * the previous tests are removed and further tests of the same name will replace each other.
   */
  test(options: TestConfig<this['__outputType'], TConfig['context']>): this;
  test(test: TestFunction<this['__outputType'], TConfig['context']>): this;
  test(
    name: string,
    test: TestFunction<this['__outputType'], TConfig['context']>,
  ): this;
  test(
    name: string,
    message: Message,
    test: TestFunction<this['__outputType'], TConfig['context']>,
  ): this;
  test(...args: any[]) {
    let opts: TestConfig;

    if (args.length === 1) {
      if (typeof args[0] === 'function') {
        opts = { test: args[0] };
      } else {
        opts = args[0];
      }
    } else if (args.length === 2) {
      opts = { name: args[0], test: args[1] };
    } else {
      opts = { name: args[0], message: args[1], test: args[2] };
    }

    if (opts.message === undefined) opts.message = locale.default;

    if (typeof opts.test !== 'function')
      throw new TypeError('`test` is a required parameters');

    const next = this.clone();
    const validate = createValidation(opts);

    const isExclusive =
      opts.exclusive || (opts.name && next.exclusiveTests[opts.name] === true);

    if (opts.exclusive) {
      if (!opts.name)
        throw new TypeError(
          'Exclusive tests must provide a unique `name` identifying the test',
        );
    }

    if (opts.name) next.exclusiveTests[opts.name] = !!opts.exclusive;

    next.tests = next.tests.filter((fn) => {
      if (fn.OPTIONS.name === opts.name) {
        if (isExclusive) return false;
        if (fn.OPTIONS.test === validate.OPTIONS.test) return false;
      }
      return true;
    });

    next.tests.push(validate);

    return next;
  }

  when(options: ConditionOptions<this>): this;
  when(keys: string | string[], options: ConditionOptions<this>): this;
  when(
    keys: string | string[] | ConditionOptions<this>,
    options?: ConditionOptions<this>,
  ) {
    if (!Array.isArray(keys) && typeof keys !== 'string') {
      options = keys;
      keys = '.';
    }

    const next = this.clone();
    const deps = toArray(keys).map((key) => new Ref(key));

    deps.forEach((dep) => {
      // @ts-ignore readonly array
      if (dep.isSibling) next.deps.push(dep.key);
    });

    next.conditions.push(new Condition(deps, options!) as Condition);

    return next;
  }

  typeError(message: Message) {
    const next = this.clone();

    next.internalTests.typeError = createValidation({
      message,
      name: 'typeError',
      test(value) {
        if (!isAbsent(value) && !this.schema._typeCheck(value))
          return this.createError({
            params: {
              type: this.schema._type,
            },
          });
        return true;
      },
    });
    return next;
  }

  oneOf<U extends TType>(
    enums: ReadonlyArray<U | Reference>,
    message = locale.oneOf,
  ): any {
    const next = this.clone();

    enums.forEach((val) => {
      next._whitelist.add(val);
      next._blacklist.delete(val);
    });

    next.internalTests.whiteList = createValidation({
      message,
      name: 'oneOf',
      test(value) {
        if (value === undefined) return true;
        const valids = this.schema._whitelist;
        const resolved = valids.resolveAll(this.resolve);

        return resolved.includes(value)
          ? true
          : this.createError({
            params: {
              values: valids.toArray().join(', '),
              resolved,
            },
          });
      },
    });

    return next;
  }

  notOneOf<U extends TType>(
    enums: (Maybe<U> | Reference)[],
    message = locale.notOneOf,
  ): this {
    const next = this.clone();
    enums.forEach((val) => {
      next._blacklist.add(val);
      next._whitelist.delete(val);
    });

    next.internalTests.blacklist = createValidation({
      message,
      name: 'notOneOf',
      test(value) {
        const invalids = this.schema._blacklist;
        const resolved = invalids.resolveAll(this.resolve);
        if (resolved.includes(value))
          return this.createError({
            params: {
              values: invalids.toArray().join(', '),
              resolved,
            },
          });
      },
    });

    return next;
  }

  strip(strip = true): Validatable<TType, SetFlag<TConfig, 's'>> {
    const next = this.clone();
    next.spec.strip = strip;
    return next as any;
  }

  /**
   * Return a serialized description of the schema including validations, flags, types etc.
   *
   * @param options Provide any needed context for resolving runtime schema alterations (lazy, when conditions, etc).
   */
  describe(options?: ResolveOptions<TConfig['context']>) {
    const next = (options ? this.resolve(options) : this).clone();
    const { label, meta, optional, nullable } = next.spec;
    const description: SchemaDescription = {
      meta,
      label,
      optional,
      nullable,
      type: next.type,
      oneOf: next._whitelist.describe(),
      notOneOf: next._blacklist.describe(),
      tests: next.tests
        .map((fn) => ({ name: fn.OPTIONS.name, params: fn.OPTIONS.params }))
        .filter(
          (n, idx, list) => list.findIndex((c) => c.name === n.name) === idx,
        ),
    };

    return description;
  }
}


export default interface Validatable<
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  TType = any,
  TConfig extends Config<any, any> = Config,
> {
  validateAt(
    path: string,
    value: any,
    options?: ValidateOptions<TConfig['context']>,
  ): Promise<any>;
  validateSyncAt(
    path: string,
    value: any,
    options?: ValidateOptions<TConfig['context']>,
  ): any;
  equals: Validatable['oneOf'];
  is: Validatable['oneOf'];
  not: Validatable['notOneOf'];
  nope: Validatable['notOneOf'];
}

// @ts-expect-error
Validatable.prototype.__isSchema__ = true;

for (const method of ['validate', 'validateSync'])
  Validatable.prototype[`${method}At` as 'validateAt' | 'validateSyncAt'] =
    function (path: string, value: any, options: ValidateOptions = {}) {
      const { parent, parentPath, schema } = getIn(
        this,
        path,
        value,
        options.context,
      );
      return schema[method](parent && parent[parentPath], {
        ...options,
        parent,
        path,
      });
    };

for (const alias of ['equals', 'is'] as const)
  Validatable.prototype[alias] = Validatable.prototype.oneOf;

for (const alias of ['not', 'nope'] as const)
  Validatable.prototype[alias] = Validatable.prototype.notOneOf;
