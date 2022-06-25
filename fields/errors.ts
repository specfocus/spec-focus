import type { LiteralUnion } from '../literals';
import type { DeepPartial } from '../objects/partial';
import type { DeepMap } from '../shapes';
import type { Message } from '../validations/errors';
import type { RegisterOptions, ValidateResult } from '../validations/validator';
import type { InternalFieldName } from './names';
import type { FieldValues } from './values';

export type FieldError<Ref = any> = {
  type: LiteralUnion<keyof RegisterOptions, string>;
  ref?: Ref;
  types?: MultipleFieldErrors;
  message?: Message;
};

export type FieldErrors<TFieldValues extends FieldValues = FieldValues, Ref = any> =
  DeepMap<DeepPartial<TFieldValues>, FieldError<Ref>>;

export type InternalFieldErrors<Ref = any> = Partial<
  Record<InternalFieldName, FieldError<Ref>>
>;

// export type MultipleFieldErrors<K extends string = keyof RegisterOptions> = Record<K, ValidateResult>;

export type MultipleFieldErrors = {
  [K in keyof RegisterOptions]?: ValidateResult;
} & {
  [key: string]: ValidateResult;
};