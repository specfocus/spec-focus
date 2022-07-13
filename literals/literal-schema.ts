import Validatable from '../validations/Validatable';
import type { Defined, Maybe, Optionals } from '../maybe';
import type { Thunk } from '../functions/thunk';
import type { Config, ToggleDefault } from '../schemas/config';
import type { Message } from '../messages';

export declare class LiteralSchema<
  TType = any,
  TConfig extends Config<any, any> = Config
> extends Validatable<TType, TConfig> {
  default<D extends Maybe<TType>>(
    def: Thunk<D>,
  ): LiteralSchema<TType, ToggleDefault<TConfig, D>>;

  concat<IT, IC extends Config<any, any>>(
    schema: LiteralSchema<IT, IC>,
  ): LiteralSchema<NonNullable<TType> | IT, TConfig & IC>;
  concat<IT, IC extends Config<any, any>>(
    schema: Validatable<IT, IC>,
  ): LiteralSchema<NonNullable<TType> | Optionals<IT>, TConfig & IC>;
  concat(schema: this): this;

  defined(msg?: Message): LiteralSchema<Defined<TType>, TConfig>;
  optional(): LiteralSchema<TType | undefined, TConfig>;

  required(msg?: Message): LiteralSchema<NonNullable<TType>, TConfig>;
  notRequired(): LiteralSchema<Maybe<TType>, TConfig>;

  nullable(msg?: Message): LiteralSchema<TType | null, TConfig>;
  nonNullable(): LiteralSchema<Exclude<TType, null>, TConfig>;
}

const Mixed: typeof LiteralSchema = Validatable as any;

export default Mixed;

export function create<TType = any>() {
  return new Mixed<TType | undefined>();
}
// XXX: this is using the Base schema so that `addMethod(mixed)` works as a base class
create.prototype = Mixed.prototype;
