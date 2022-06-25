import isSchema from '../schemas/is-schema';
import Reference from '../references/reference-schema';
import { SchemaLike } from '../schemas';

export interface ConditionBuilder<T extends SchemaLike> {
  (this: T, value: any, schema: T): SchemaLike;
  (v1: any, v2: any, schema: T): SchemaLike;
  (v1: any, v2: any, v3: any, schema: T): SchemaLike;
  (v1: any, v2: any, v3: any, v4: any, schema: T): SchemaLike;
}

export type ConditionConfig<T extends SchemaLike> = {
  is: any | ((...values: any[]) => boolean);
  then?: SchemaLike | ((schema: T) => SchemaLike);
  otherwise?: SchemaLike | ((schema: T) => SchemaLike);
};

export type ConditionOptions<T extends SchemaLike> =
  | ConditionBuilder<T>
  | ConditionConfig<T>;

export type ResolveOptions<TContext = any> = {
  value?: any;
  parent?: any;
  context?: TContext;
};

class Condition<T extends SchemaLike = SchemaLike> {
  fn: ConditionBuilder<T>;
  refs: Reference[]

  constructor(refs: Reference[], options: ConditionOptions<T>) {
    this.refs = refs;

    if (typeof options === 'function') {
      this.fn = options;
      return;
    }

    if (!('is' in options))
      throw new TypeError('`is:` is required for `when()` conditions');

    if (!options.then && !options.otherwise)
      throw new TypeError(
        'either `then:` or `otherwise:` is required for `when()` conditions',
      );

    const { is, then, otherwise } = options;

    const check =
      typeof is === 'function'
        ? is
        : (...values: any[]) => values.every((value) => value === is);

    this.fn = function (...args: any[]) {
      const options = args.pop();
      const schema = args.pop();
      const branch = check(...args) ? then : otherwise;

      if (!branch) return undefined;
      if (typeof branch === 'function') return branch(schema);
      return schema.concat(branch.resolve(options));
    };
  }

  resolve(base: T, options: ResolveOptions) {
    const values = this.refs.map((ref) =>
      ref.getValue(options?.value, options?.parent, options?.context),
    );

    const schema = this.fn.apply(base, values.concat(base, options) as any);

    if (schema === undefined || schema === base) return base;

    if (!isSchema(schema))
      throw new TypeError('conditions must return a schema object');

    return schema.resolve(options);
  }
}

export default Condition;
