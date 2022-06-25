import type { Shape } from '../anything';
import AnythingSchema from '../anything/anything-schema';
import isAbsent from '../anything/is-absent';
import type { Defined, Maybe, NotNull } from '../maybe';
import type { Thunk } from '../functions/thunk';
import Ref from '../references/reference-schema';
import type { Config, ToggleDefault } from '../schemas/config';
import { date as locale } from '../validations/locale';
import type { Message } from '../messages';
import isoParse from './isodate';

const invalidDate = new Date('');

const isDate = (obj: any): obj is Date =>
  Object.prototype.toString.call(obj) === '[object Date]';

export function create(): DateSchema;
export function create<T extends Date, TContext = Shape>(): DateSchema<
  T | undefined,
  Config<TContext>
>;
export function create() {
  return new DateSchema();
}

export default class DateSchema<
  TType extends Maybe<Date> = Date | undefined,
  TConfig extends Config<any, any> = Config
> extends AnythingSchema<TType, TConfig> {
  static INVALID_DATE = invalidDate;

  constructor() {
    super({ type: 'date' });

    this.withMutation(() => {
      this.transform(function (value) {
        if (this.isType(value)) return value;

        value = isoParse(value);

        // 0 is a valid timestamp equivalent to 1970-01-01T00:00:00Z(unix epoch) or before.
        return !isNaN(value) ? new Date(value) : invalidDate;
      });
    });
  }

  protected _typeCheck(v: any): v is NonNullable<TType> {
    return isDate(v) && !isNaN(v.getTime());
  }

  private prepareParam(
    ref: unknown | Ref<Date>,
    name: string,
  ): Date | Ref<Date> {
    let param: Date | Ref<Date>;

    if (!Ref.isRef(ref)) {
      const cast = this.cast(ref);
      if (!this._typeCheck(cast))
        throw new TypeError(
          `\`${name}\` must be a Date or a value that can be \`cast()\` to a Date`,
        );
      param = cast;
    } else {
      param = ref as Ref<Date>;
    }
    return param;
  }

  min(min: unknown | Ref<Date>, message = locale.min) {
    const limit = this.prepareParam(min, 'min');

    return this.test({
      message,
      name: 'min',
      exclusive: true,
      params: { min },
      test(value) {
        return isAbsent(value) || value >= this.resolve(limit);
      },
    });
  }

  max(max: unknown | Ref, message = locale.max) {
    const limit = this.prepareParam(max, 'max');

    return this.test({
      message,
      name: 'max',
      exclusive: true,
      params: { max },
      test(value) {
        return isAbsent(value) || value <= this.resolve(limit);
      },
    });
  }
}

create.prototype = DateSchema.prototype;
create.INVALID_DATE = invalidDate;

export default interface DateSchema<
  TType extends Maybe<Date>,
  TConfig extends Config<any, any> = Config
> extends AnythingSchema<TType, TConfig> {
  default<D extends Maybe<TType>>(
    def: Thunk<D>,
  ): DateSchema<TType, ToggleDefault<TConfig, D>>;

  concat<TOther extends DateSchema<any, any>>(schema: TOther): TOther;

  defined(msg?: Message): DateSchema<Defined<TType>, TConfig>;
  optional(): DateSchema<TType | undefined, TConfig>;

  required(msg?: Message): DateSchema<NonNullable<TType>, TConfig>;
  notRequired(): DateSchema<Maybe<TType>, TConfig>;

  nullable(msg?: Message): DateSchema<TType | null, TConfig>;
  nonNullable(): DateSchema<NotNull<TType>, TConfig>;
}
