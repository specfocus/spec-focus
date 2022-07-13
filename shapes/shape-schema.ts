import Validatable from '../validations/Validatable';
import type { Defined, NotNull, _ } from '../maybe';
import type { Maybe, Optionals, Preserve } from '../maybe';
import type { ResolveOptions } from '../conditions';
import type { Thunk } from '../functions';
import type { Callback } from '../functions/callback';
import type Lazy from '../lazy/lazy-schema';
import type Reference from '../references/reference-schema';
import type { AnySchema, SchemaSpec, TypedSchema } from '../schemas';
import type { Config, ResolveFlags, ToggleDefault } from '../schemas/config';
import type { SchemaObjectDescription } from '../schemas/description';
import { camelCase, snakeCase } from '../strings/string';
import { ValidationError } from '../validations/error';
import { object as locale } from '../validations/locale';
import type { Message } from '../messages';
import type { InternalOptions } from '../validations/options';
import runTests from '../validations/run-tests';
import sortByKeyOrder from '../validations/sort-by-key-order';
import sortFields from '../validations/sort-fields';
import { MakePartial } from '../objects/partial';
import { getter, join, normalizePath } from '../objects/property-expr';

export type Assign<T extends {}, U extends {}> = {
  [P in keyof T]: P extends keyof U ? U[P] : T[P];
} & U;

export type AnyObject = Record<string, any>;

export type ObjectShape = Record<
  string,
  AnySchema | Reference | Lazy<any, any>
>;

type FieldType<
  T extends AnySchema | Reference | Lazy<any, any>,
  F extends '__type' | '__outputType',
> = T extends TypedSchema ? T[F] : T extends Reference ? unknown : never;

export type DefaultFromShape<Shape extends ObjectShape> = {
  [K in keyof Shape]: Shape[K] extends ObjectSchema<infer TShape>
    ? DefaultFromShape<TShape>
    : Shape[K] extends { getDefault: () => infer D }
    ? Preserve<D, undefined> extends never
      ? Defined<D>
      : Preserve<D, undefined>
    : undefined;
};

export type TypeOfShape<S extends ObjectShape> = {
  [K in keyof S]: FieldType<S[K], '__type'>;
};

// type Strip<K, V> = V extends AnySchema
//   ? HasFlag<V, 's'> extends never
//     ? K
//     : never
//   : K;

export type AssertsShape<S extends ObjectShape> = MakePartial<{
  [K in keyof S]: FieldType<S[K], '__outputType'>;
}> & { [k: string]: any };

export type PartialSchema<S extends ObjectShape> = {
  [K in keyof S]: S[K] extends Validatable ? ReturnType<S[K]['optional']> : S[K];
};

export type DeepPartialSchema<S extends ObjectShape> = {
  [K in keyof S]: S[K] extends ObjectSchema<any, any, any>
    ? ReturnType<S[K]['deepPartial']>
    : S[K] extends Validatable
    ? ReturnType<S[K]['optional']>
    : S[K];
};

export type ObjectSchemaSpec = SchemaSpec<any> & {
  noUnknown?: boolean;
};

const deepHas = (obj: any, p: string) => {
  const path = [...normalizePath(p)];
  if (path.length === 1) return path[0] in obj;
  const last = path.pop()!;
  const parent = getter(join(path), true)(obj);
  return !!(parent && last in parent);
};

const isObject = (obj: any): obj is Record<PropertyKey, unknown> =>
  Object.prototype.toString.call(obj) === '[object Object]';

function unknown(ctx: ObjectSchema<any, any, any>, value: any) {
  const known = Object.keys(ctx.fields);
  return Object.keys(value).filter((key) => known.indexOf(key) === -1);
}

const defaultSort = sortByKeyOrder([]);

export default class ObjectSchema<
  TShape extends ObjectShape = {},
  TConfig extends Config<any, any> = Config<AnyObject, 'd'>,
  TIn extends Maybe<AssertsShape<TShape>> = AssertsShape<TShape> | undefined,
> extends Validatable<TIn, TConfig> {
  fields: TShape = Object.create(null);

  declare spec: ObjectSchemaSpec;

  declare readonly __outputType: ResolveFlags<_<TIn>, TConfig['flags']>;

  private _sortErrors = defaultSort;
  private _nodes: readonly string[] = [];

  private _excludedEdges: readonly [nodeA: string, nodeB: string][] = [];

  constructor(spec?: TShape) {
    super({
      type: 'object',
    });

    this.withMutation(() => {
      this.transform(function coerce(value) {
        if (typeof value === 'string') {
          try {
            value = JSON.parse(value);
          } catch (err) {
            value = null;
          }
        }
        if (this.isType(value)) return value;
        return null;
      });

      if (spec) {
        this.shape(spec);
      }
    });
  }

  protected _typeCheck(value: any): value is NonNullable<TIn> {
    return isObject(value) || typeof value === 'function';
  }

  protected _cast(
    _value: any,
    options: InternalOptions<TConfig['context']> = {},
  ) {
    const value = super._cast(_value, options);

    // should ignore nulls here
    if (value === undefined) return this.getDefault();

    if (!this._typeCheck(value)) return value;

    const fields = this.fields;

    const strip = options.stripUnknown ?? this.spec.noUnknown;
    const props = this._nodes.concat(
      Object.keys(value).filter((v) => this._nodes.indexOf(v) === -1),
    );

    const intermediateValue: Record<string, unknown> = {}; // is filled during the transform below
    const innerOptions: InternalOptions = {
      ...options,
      parent: intermediateValue,
      __validating: options.__validating || false,
    };

    let isChanged = false;
    for (const prop of props) {
      let field = fields[prop];
      const exists = prop in value!;

      if (field) {
        let fieldValue;
        const inputValue = value[prop];

        // safe to mutate since this is fired in sequence
        innerOptions.path = (options.path ? `${options.path}.` : '') + prop;
        // innerOptions.value = value[prop];

        field = field.resolve({
          value: inputValue,
          context: options.context,
          parent: intermediateValue,
        });

        const fieldSpec = field instanceof Validatable ? field.spec : undefined;
        const strict = fieldSpec?.strict;

        if (fieldSpec?.strip) {
          isChanged = isChanged || prop in value;
          continue;
        }

        fieldValue =
          !options.__validating || !strict
            ? // TODO: use _cast, this is double resolving
              field.cast(value[prop], innerOptions)
            : value[prop];

        if (fieldValue !== undefined) {
          intermediateValue[prop] = fieldValue;
        }
      } else if (exists && !strip) {
        intermediateValue[prop] = value[prop];
      }

      if (intermediateValue[prop] !== value[prop]) {
        isChanged = true;
      }
    }

    return isChanged ? intermediateValue : value;
  }

  protected _validate(
    _value: any,
    opts: InternalOptions<TConfig['context']> = {},
    callback: Callback,
  ) {
    const errors = [] as ValidationError[];
    let {
      sync,
      from = [],
      originalValue = _value,
      abortEarly = this.spec.abortEarly,
      recursive = this.spec.recursive,
    } = opts;

    from = [{ schema: this, value: originalValue }, ...from];

    // this flag is needed for handling `strict` correctly in the context of
    // validation vs just casting. e.g strict() on a field is only used when validating
    opts.__validating = true;
    opts.originalValue = originalValue;
    opts.from = from;

    super._validate(_value, opts, (err, value) => {
      if (err) {
        if (!ValidationError.isError(err) || abortEarly) {
          return void callback(err, value);
        }
        errors.push(err);
      }

      if (!recursive || !isObject(value)) {
        callback(errors[0] || null, value);
        return;
      }

      originalValue = originalValue || value;

      const tests = this._nodes.map((key) => (__: any, cb: Callback) => {
        const path =
          key.indexOf('.') === -1
            ? (opts.path ? `${opts.path}.` : '') + key
            : `${opts.path || ''}["${key}"]`;

        const field = this.fields[key];

        if (field && 'validate' in field) {
          field.validate(
            value[key],
            {
              ...opts,
              // @ts-ignore
              path,
              from,
              // inner fields are always strict:
              // 1. this isn't strict so the casting will also have cast inner values
              // 2. this is strict in which case the nested values weren't cast either
              strict: true,
              parent: value,
              originalValue: originalValue[key],
            },
            cb,
          );
          return;
        }

        cb(null);
      });

      runTests(
        {
          sync,
          tests,
          value,
          errors,
          endEarly: abortEarly,
          sort: this._sortErrors,
          path: opts.path,
        },
        callback,
      );
    });
  }

  clone(spec?: ObjectSchemaSpec): this {
    const next = super.clone(spec);
    next.fields = { ...this.fields };
    next._nodes = this._nodes;
    next._excludedEdges = this._excludedEdges;
    next._sortErrors = this._sortErrors;

    return next;
  }

  concat<TOther extends ObjectSchema<any, any, any>>(
    schema: TOther,
  ): TOther extends ObjectSchema<infer S, infer C, infer IType>
    ? ObjectSchema<
        TShape & S,
        TConfig & C,
        AssertsShape<TShape & S> | Optionals<IType>
      >
    : never;
  concat(schema: this): this;
  concat(schema: any): any {
    const next = super.concat(schema) as any;

    const nextFields = next.fields;
    for (const [field, schemaOrRef] of Object.entries(this.fields)) {
      const target = nextFields[field];
      if (target === undefined) {
        nextFields[field] = schemaOrRef;
      } else if (
        target instanceof Validatable &&
        schemaOrRef instanceof Validatable
      ) {
        nextFields[field] = schemaOrRef.concat(target);
      }
    }

    return next.withMutation((s: any) =>
      s.setFields(nextFields, this._excludedEdges),
    );
  }

  protected _getDefault() {
    if ('default' in this.spec) {
      return super._getDefault();
    }

    // if there is no default set invent one
    if (!this._nodes.length) {
      return undefined;
    }
    return this.getDefaultFromShape();
  }

  getDefaultFromShape(): _<DefaultFromShape<TShape>> {
    const dft = {} as Record<string, unknown>;
    this._nodes.forEach((key) => {
      const field = this.fields[key];
      dft[key] = 'default' in field ? field.getDefault() : undefined;
    });
    return dft as any;
  }

  private setFields<S extends ObjectShape>(
    shape: S,
    excludedEdges?: readonly [string, string][],
  ): ObjectSchema<S, TConfig, AssertsShape<S> | Optionals<TIn>> {
    const next = this.clone() as any;
    next.fields = shape;

    next._nodes = sortFields(shape, excludedEdges);
    next._sortErrors = sortByKeyOrder(Object.keys(shape));
    // XXX: this carries over edges which may not be what you want
    if (excludedEdges) next._excludedEdges = excludedEdges;
    return next;
  }

  shape<TNextShape extends ObjectShape>(
    additions: TNextShape,
    excludes: [string, string][] = [],
  ) {
    return this.clone().withMutation((next) => {
      let edges = next._excludedEdges;
      if (excludes.length) {
        if (!Array.isArray(excludes[0])) excludes = [excludes as any];

        edges = [...next._excludedEdges, ...excludes];
      }

      // XXX: excludes here is wrong
      return next.setFields(
        Object.assign(next.fields, additions) as Assign<TShape, TNextShape>,
        edges,
      );
    });
  }

  partial() {
    const partial: any = {};
    for (const [key, schema] of Object.entries(this.fields)) {
      partial[key] = schema instanceof Validatable ? schema.optional() : schema;
    }

    return this.setFields(partial as PartialSchema<TShape>);
  }

  deepPartial(): ObjectSchema<
    DeepPartialSchema<TShape>,
    TConfig,
    Optionals<TIn> | undefined | AssertsShape<DeepPartialSchema<TShape>>
  > {
    const partial: any = {};
    for (const [key, schema] of Object.entries(this.fields)) {
      if (schema instanceof ObjectSchema) partial[key] = schema.deepPartial();
      else
        partial[key] =
          schema instanceof Validatable ? schema.optional() : schema;
    }

    return this.setFields(partial as DeepPartialSchema<TShape>);
  }

  pick<TKey extends keyof TShape>(keys: TKey[]) {
    const picked: any = {};
    for (const key of keys) {
      if (this.fields[key]) picked[key] = this.fields[key];
    }

    return this.setFields(picked as Pick<TShape, TKey>);
  }

  omit<TKey extends keyof TShape>(keys: TKey[]) {
    const fields = { ...this.fields };

    for (const key of keys) {
      delete fields[key];
    }

    return this.setFields(fields as Omit<TShape, TKey>);
  }

  from(from: string, to: keyof TShape, alias?: boolean) {
    const fromGetter = getter(from, true);

    return this.transform((obj) => {
      if (!obj) return obj;
      let newObj = obj;
      if (deepHas(obj, from)) {
        newObj = { ...obj };
        if (!alias) delete newObj[from];

        newObj[to] = fromGetter(obj);
      }

      return newObj;
    });
  }

  noUnknown(noAllow = true, message = locale.noUnknown) {
    if (typeof noAllow === 'string') {
      message = noAllow;
      noAllow = true;
    }

    const next = this.test({
      name: 'noUnknown',
      exclusive: true,
      message,
      test(value) {
        if (value == null) return true;
        const unknownKeys = unknown(this.schema, value);
        return (
          !noAllow ||
          unknownKeys.length === 0 ||
          this.createError({ params: { unknown: unknownKeys.join(', ') } })
        );
      },
    });

    next.spec.noUnknown = noAllow;

    return next;
  }

  unknown(allow = true, message = locale.noUnknown) {
    return this.noUnknown(!allow, message);
  }

  transformKeys(fn: (key: string) => string) {
    return this.transform((obj) => {
      if (!obj) return obj;
      const result: AnyObject = {};
      for (const key of Object.keys(obj)) result[fn(key)] = obj[key];
      return result;
    });
  }

  camelCase() {
    return this.transformKeys(camelCase);
  }

  snakeCase() {
    return this.transformKeys(snakeCase);
  }

  constantCase() {
    return this.transformKeys((key) => snakeCase(key).toUpperCase());
  }

  describe(options?: ResolveOptions<TConfig['context']>) {
    const base = super.describe(options) as SchemaObjectDescription;
    base.fields = {};
    for (const [key, value] of Object.entries(this.fields)) {
      let innerOptions = options;
      if (innerOptions?.value) {
        innerOptions = {
          ...innerOptions,
          parent: innerOptions.value,
          value: innerOptions.value[key],
        };
      }
      base.fields[key] = value.describe(innerOptions);
    }
    return base;
  }
}

export function create<TShape extends ObjectShape = {}>(spec?: TShape) {
  return new ObjectSchema<TShape>(spec);
}

create.prototype = ObjectSchema.prototype;

export default interface ObjectSchema<
  TShape extends ObjectShape,
  TConfig extends Config<any, any> = Config<AnyObject, 'd'>,
  TIn extends Maybe<AssertsShape<TShape>> = AssertsShape<TShape> | undefined,
> extends Validatable<TIn, TConfig> {
  default<D extends Maybe<AnyObject>>(
    def: Thunk<D>,
  ): ObjectSchema<TShape, ToggleDefault<TConfig, D>, TIn>;

  defined(msg?: Message): ObjectSchema<TShape, TConfig, Defined<TIn>>;
  optional(): ObjectSchema<TShape, TConfig, TIn | undefined>;

  required(msg?: Message): ObjectSchema<TShape, TConfig, NonNullable<TIn>>;
  notRequired(): ObjectSchema<TShape, TConfig, Maybe<TIn>>;

  nullable(isNullable?: true): ObjectSchema<TShape, TConfig, TIn | null>;
  nullable(isNullable: false): ObjectSchema<TShape, TConfig, NotNull<TIn>>;
}
